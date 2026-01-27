import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

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
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://localhost:27017/ssswj',
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ], // 导入其他模块，用于导入其他模块的功能，如数据库连接、外部API等
  controllers: [AppController], // 控制http请求，用于处理传入的HTTP请求并返回响应
  providers: [AppService], // 注册服务类 通常为业务逻辑，用于提供业务逻辑和数据处理
})
export class AppModule {} // 导出模块类，使其他模块可以导入和使用
