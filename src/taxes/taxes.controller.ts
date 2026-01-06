// src/taxes/taxes.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles.enum';
import { Types } from 'mongoose';

@Controller('taxes')
export class TaxesController {
  constructor(private readonly service: TaxesService) {}

  // GET /taxes  (any logged-in user can read taxes)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.service.findAll();
  }

  // GET /taxes/:id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id format');
    return this.service.findById(id);
  }

  // POST /taxes  (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() body: CreateTaxDto) {
    // basic DTO is validated by global ValidationPipe if enabled; otherwise rely on service checks
    return this.service.create({
      appliesTo: body.appliesTo,
      tax: body.tax,
      name: body.name,
      isActive: body.isActive,
    });
  }

  // PUT /taxes/:id (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTaxDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id format');
    return this.service.updateById(id, body as any);
  }

  // DELETE /taxes/:id (admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id format');
    return this.service.deleteById(id);
  }
}
