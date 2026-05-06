import { Module, type MiddlewareConsumer, type NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth';
import { resolveDbConfig } from './config/db-config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProfileModule } from './profile/profile.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { LoggingModule } from './common/logging/logging.module';
import { GlobalExceptionFilter } from './common/logging/global-exception.filter';
import { HttpLoggingInterceptor } from './common/logging/http-logging.interceptor';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';

@Module({
  imports: [
    LoggingModule,
    AuthModule,
    RestaurantModule,
    UserModule,
    ReviewModule,
    ProfileModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const db = await resolveDbConfig();
        return {
          type: 'mysql' as const,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
