// src/popular-products/popular-products.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PopularProductsService } from './popular-products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles.enum';
import { CreatePopularDto } from './dto/create-popular.dto';

@Controller('popular-products')
export class PopularProductsController {
  constructor(private readonly service: PopularProductsService) {}

  // USER → GET ALL POPULAR PRODUCTS
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.service.findAll();
  }

  // ADMIN → ADD POPULAR PRODUCT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() dto: CreatePopularDto) {
    return this.service.create(dto.productId, dto.productType);
  }

  // ADMIN → REMOVE POPULAR PRODUCT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
