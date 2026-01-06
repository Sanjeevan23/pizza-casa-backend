// src/favourite-products/favourite-products.controller.ts
import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  UseGuards,
  Req,
  Param,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FavouriteProductsService } from './favourite-products.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Types } from 'mongoose';

@Controller('favourites')
@UseGuards(JwtAuthGuard)
export class FavouriteProductsController {
  constructor(private readonly service: FavouriteProductsService) {}

  // ADD favourite
  @Post()
  async add(@Req() req: any, @Body() dto: CreateFavouriteDto) {
    // Make sure JWT contains sub (we sign payload with sub in auth.service)
    const jwtUser = req.user;
    const userId = jwtUser?.sub ?? jwtUser?.userId;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedException('Invalid authentication token (user id missing)');
    }

    return this.service.addFavourite(userId, dto);
  }

  // REMOVE favourite by product id
  @Delete(':productId')
  async remove(@Req() req: any, @Param('productId') productId: string) {
    const jwtUser = req.user;
    const userId = jwtUser?.sub ?? jwtUser?.userId;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedException('Invalid authentication token (user id missing)');
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid productId');
    }

    return this.service.removeFavourite(userId, productId);
  }

  // GET my favourites
  @Get()
  async myFavourites(@Req() req: any) {
    const jwtUser = req.user;
    const userId = jwtUser?.sub ?? jwtUser?.userId;
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new UnauthorizedException('Invalid authentication token (user id missing)');
    }

    return this.service.getUserFavourites(userId);
  }
}
