// src/offers/offers.controller.ts
import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, BadRequestException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles.enum';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // Public for logged-in users: only active offers
  @UseGuards(JwtAuthGuard)
  @Get()
  async getActive() {
    return this.offersService.findAllActive();
  }

  // Admin: get all offers (active + expired)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin')
  async getAllAdmin() {
    return this.offersService.findAllAdmin();
  }

  // Admin create or replace (upsert)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: CreateOfferDto) {
    // DTO validation (class-validator on controller level already works if global ValidationPipe is used,
    // but we double-check if someone skipped)
    const dto = plainToInstance(CreateOfferDto, body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const msgs = errors.flatMap(e => Object.values(e.constraints || {}));
      throw new BadRequestException(msgs);
    }

    // create or replace
    const start = new Date(body.startDate);
    const end = new Date(body.endDate);

    return this.offersService.createOrReplace({
      productId: body.productId,
      productType: body.productType,
      offer: Number(body.offer),
      startDate: start,
      endDate: end,
      isActive: body.isActive ?? true,
    });
  }

  // Admin update by offer id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateOfferDto) {
    return this.offersService.updateById(id, body as any);
  }

  // Admin delete by offer id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.offersService.deleteById(id);
  }
}
