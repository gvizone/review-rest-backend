import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BulkImportRestaurantsDto } from './dto/bulk-import-restaurants.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { Public } from 'src/auth';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  @Get()
  findAll() {
    return this.restaurantService.findAll();
  }

  @Public()
  @Get('categories')
  findCategories() {
    return this.restaurantService.findCategories();
  }

  /** Paginated list / text search (must stay above `:id` so `search` is not captured as an id). */
  @Public()
  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = parseInt(page ?? '1', 10);
    const lim = parseInt(limit ?? '10', 10);
    return this.restaurantService.searchPaginated(q ?? '', p, lim);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findById(id);
  }

  @Public()
  @Get('category/:categoryName')
  findByCategory(@Param('categoryName') categoryName: string) {
    return this.restaurantService.findByCategory(categoryName);
  }

  @Post()
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantService.update(id, dto);
  }

  /** Import many restaurants from a JSON dump (`items` may include optional `id` per row). */
  @Post('bulk')
  @HttpCode(201)
  bulkCreate(@Body() dto: BulkImportRestaurantsDto) {
    return this.restaurantService.bulkCreate(dto);
  }

  @Delete()
  deleteAll() {
    return this.restaurantService.deleteAll();
  }
}
