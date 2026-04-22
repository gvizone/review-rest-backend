import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }
}
