// src/taxes/dto/update-tax.dto.ts
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaxDto {
  @IsOptional()
  @IsEnum(['food', 'beverage', 'all'])
  appliesTo?: 'food' | 'beverage' | 'all';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  isActive?: boolean;
}
