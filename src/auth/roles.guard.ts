import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 创建角色守卫
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(executionContext: ExecutionContext) {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      executionContext.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = executionContext.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
