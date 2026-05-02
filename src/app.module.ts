import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { env } from './config/env';
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
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.db.host,
      port: env.db.port,
      username: env.db.username,
      password: env.db.password,
      database: env.db.database,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
