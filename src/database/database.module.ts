import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'mongodb');
        if (dbType === 'mongodb') {
          return {
            type: 'mongodb',
            url: configService.get('MONGODB_URL'),
            useNewUrlParser: true,
            useUnifiedTopology: true,
          };
        } else if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: configService.get('POSTGRES_URL'),
            // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }
        throw new Error(`Unsupported database type: ${dbType}`);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
