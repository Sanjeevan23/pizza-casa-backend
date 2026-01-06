// src/offers/dto/update-offer.dto.ts
import { IsEnum, IsMongoId, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class UpdateOfferDto {
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsOptional()
  @IsEnum(['food', 'beverage'])
  productType?: 'food' | 'beverage';

  @IsOptional()
  @TransformType(() => Number)
  @IsNumber()
  offer?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  isActive?: boolean;
}
