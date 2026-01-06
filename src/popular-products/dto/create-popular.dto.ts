// src/popular-products/dto/create-popular.dto.ts
import { IsEnum, IsMongoId } from 'class-validator';

export class CreatePopularDto {
  @IsMongoId()
  productId: string;

  @IsEnum(['food', 'beverage'])
  productType: 'food' | 'beverage';
}
