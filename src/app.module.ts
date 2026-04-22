import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [RestaurantModule, UserModule, ReviewModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
