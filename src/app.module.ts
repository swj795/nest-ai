import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { InterviewModule } from './interview/interview.module';
import { DatabaseModule } from './database/database.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CommonModule } from './common/common.module';

/**
 * 模块装饰器，用于定义模块
 * @Module 装饰器接收一个配置对象，用于描述模块的元数据
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          configService.get<string>('MONGODB_URL') ||
          'mongodb://localhost:27017/ssswj',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    InterviewModule,
    DatabaseModule,
    CommonModule,
    // JwtModule.register({
    //   secret: '123456789',
    //   signOptions: { expiresIn: '1d' },
    // }),
  ], // 导入其他模块，用于导入其他模块的功能，如数据库连接、外部API等
  controllers: [AppController], // 控制http请求，用于处理传入的HTTP请求并返回响应
  providers: [
    AppService,
    LoggerMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ], // 注册服务类 通常为业务逻辑，用于提供业务逻辑和数据处理
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
} // 导出模块类，使其他模块可以导入和使用
