import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RESTAURANT_REPOSITORY } from './domain/restaurant.repository.token';
import { Restaurant } from './domain/restaurant.entity';
import { RestaurantTypeOrmRepository } from './infrastructure/restaurant.repository.typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: RESTAURANT_REPOSITORY,
      useClass: RestaurantTypeOrmRepository,
    },
  ],
  exports: [RestaurantService],
})
export class RestaurantModule {}
