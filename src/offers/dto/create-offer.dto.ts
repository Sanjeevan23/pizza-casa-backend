// src/offers/dto/create-offer.dto.ts
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNotEmpty()
  @IsEnum(['food', 'beverage'])
  productType: 'food' | 'beverage';

  @IsNotEmpty()
  @TransformType(() => Number)
  @IsNumber()
  offer: number;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  isActive?: boolean;
}
