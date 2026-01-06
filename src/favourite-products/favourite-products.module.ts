// src/favourite-products/favourite-products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavouriteProductsController } from './favourite-products.controller';
import { FavouriteProductsService } from './favourite-products.service';
import {
  FavouriteProduct,
  FavouriteProductSchema,
} from './schemas/favourite-products.schema';
import { Food, FoodSchema } from '../products/food/schemas/food.schema';
import {
  Beverage,
  BeverageSchema,
} from '../products/beverage/schemas/beverage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FavouriteProduct.name, schema: FavouriteProductSchema },
      { name: Food.name, schema: FoodSchema },
      { name: Beverage.name, schema: BeverageSchema },
    ]),
  ],
  controllers: [FavouriteProductsController],
  providers: [FavouriteProductsService],
})
export class FavouriteProductsModule { }
