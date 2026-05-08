import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动删除未声明的字段
      forbidNonWhitelisted: true, // 有未声明的字段报错
      transform: true, // 自动转换数据类型
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
    }),
  );
}
void bootstrap();
