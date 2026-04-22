import { IsNumber, Max, Min } from 'class-validator';

export class ReviewNoteDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  service: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  food: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  value: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  atmosphere: number;
}
