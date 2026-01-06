// src/taxes/dto/create-tax.dto.ts
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaxDto {
  @IsOptional()
  @IsEnum(['food', 'beverage', 'all'])
  appliesTo?: 'food' | 'beverage' | 'all'; // default 'all' if not provided

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  tax: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  isActive?: boolean;
}
