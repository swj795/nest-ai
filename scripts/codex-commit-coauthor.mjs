#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function findLatestStateDb(codexDir) {
  const entries = fs
    .readdirSync(codexDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^state_\d+\.sqlite$/.test(entry.name))
    .map((entry) => {
      const fullPath = path.join(codexDir, entry.name);
      const stat = fs.statSync(fullPath);
      return { fullPath, mtimeMs: stat.mtimeMs };
    })
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  return entries[0]?.fullPath ?? null;
}

function getGitTopLevel() {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function runSqliteQuery(dbPath, threadId) {
  const query = [
    '.mode list',
    '.separator |',
    `select coalesce(model_provider, ''), coalesce(model, '') from threads where id = '${threadId.replaceAll("'", "''")}' limit 1;`,
  ].join('\n');

  try {
    const output = execFileSync('sqlite3', [dbPath], {
      input: query,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    if (!output) {
      return { modelProvider: '', model: '' };
    }

    const [modelProvider = '', model = ''] = output.split('|');
    return { modelProvider, model };
  } catch {
    return { modelProvider: '', model: '' };
  }
}

function parseCodexConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    return { modelProvider: '', model: '' };
  }

  const lines = readText(configPath).split(/\r?\n/);
  let model = '';
  let modelProvider = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('[')) {
      continue;
    }

    const modelMatch = trimmed.match(/^model\s*=\s*"([^"]+)"\s*$/);
    if (modelMatch && !model) {
      model = modelMatch[1];
      continue;
    }

    const providerMatch = trimmed.match(/^model_provider\s*=\s*"([^"]+)"\s*$/);
    if (providerMatch && !modelProvider) {
      modelProvider = providerMatch[1];
    }
  }

  return { modelProvider, model };
}

function loadMapping(repoRoot) {
  const mapPath = process.env.CODEX_COAUTHOR_MAP_PATH
    ? path.resolve(process.env.CODEX_COAUTHOR_MAP_PATH)
    : path.join(repoRoot, 'codex-coauthors.json');

  if (fs.existsSync(mapPath)) {
    return readJson(mapPath);
  }

  return {
    models: {},
    providers: {},
    fallback: {
      name: 'Codex',
      email: 'noreply@openai.com',
    },
  };
}

function resolveIdentity(mapping, model, modelProvider) {
  const models = mapping.models ?? {};
  const providers = mapping.providers ?? {};
  const fallback = mapping.fallback ?? {};

  const candidate =
    (model && models[model]) ||
    (modelProvider && providers[modelProvider]) ||
    fallback;

  const name = candidate.name ?? 'Codex';
  const email = candidate.email ?? 'noreply@openai.com';

  return `${name} <${email}>`;
}

function hasCoauthoredBy(messageFile) {
  const contents = readText(messageFile);
  return /^Co-authored-by:\s+/im.test(contents);
}

function appendCoauthor(messageFile, coauthor) {
  execFileSync(
    'git',
    [
      'interpret-trailers',
      '--in-place',
      '--if-exists=doNothing',
      '--trailer',
      `Co-authored-by: ${coauthor}`,
      messageFile,
    ],
    {
      stdio: 'ignore',
    },
  );
}

function main() {
  const [messageFile, source = ''] = process.argv.slice(2);

  if (!messageFile || !fs.existsSync(messageFile)) {
    process.exit(0);
  }

  if (process.env.CODEX_COAUTHOR_DISABLE === '1') {
    process.exit(0);
  }

  if (!process.env.CODEX_THREAD_ID) {
    process.exit(0);
  }

  if (source === 'merge' || source === 'squash') {
    process.exit(0);
  }

  if (hasCoauthoredBy(messageFile)) {
    process.exit(0);
  }

  const repoRoot = getGitTopLevel();
  if (!repoRoot) {
    process.exit(0);
  }

  const codexDir = path.join(os.homedir(), '.codex');
  const stateDb = fs.existsSync(codexDir) ? findLatestStateDb(codexDir) : null;
  const configPath = path.join(codexDir, 'config.toml');
  const config = parseCodexConfig(configPath);
  const mapping = loadMapping(repoRoot);

  let model = config.model;
  let modelProvider = config.modelProvider;

  if (stateDb) {
    const thread = runSqliteQuery(stateDb, process.env.CODEX_THREAD_ID);
    modelProvider = thread.modelProvider || modelProvider;
    model = thread.model || model;
  }

  const coauthor = resolveIdentity(mapping, model, modelProvider);
  appendCoauthor(messageFile, coauthor);
}

main();
