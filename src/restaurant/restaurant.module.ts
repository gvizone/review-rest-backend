import { Module } from '@nestjs/common';
import { RestaurantRepositoryMock } from './infrastructure/restaurant.repository.mock';
import { RESTAURANT_REPOSITORY } from './domain/restaurant.repository.token';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: RESTAURANT_REPOSITORY,
      useClass: RestaurantRepositoryMock,
    },
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
