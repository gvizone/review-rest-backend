import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth';
import { resolveDbConfig } from './config/db-config';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ProfileModule } from './profile/profile.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
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
  providers: [],
})
export class AppModule {}
