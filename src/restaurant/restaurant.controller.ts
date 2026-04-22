import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get('categories')
  findCategories() {
    return this.restaurantService.findCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Get('category/:categoryName')
  findByCategory(@Param('categoryName') categoryName: string) {
    return this.restaurantService.findByCategory(categoryName);
  }

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }
}
