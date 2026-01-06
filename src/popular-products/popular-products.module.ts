//src/popular-products/popular-products.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PopularProductsController } from './popular-products.controller';
import { PopularProductsService } from './popular-products.service';
import {
  PopularProduct,
  PopularProductSchema,
} from './schemas/popular-product.schema';
import { Food, FoodSchema } from '../products/food/schemas/food.schema';
import {
  Beverage,
  BeverageSchema,
} from '../products/beverage/schemas/beverage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PopularProduct.name, schema: PopularProductSchema },
      { name: Food.name, schema: FoodSchema },
      { name: Beverage.name, schema: BeverageSchema },
    ]),
  ],
  controllers: [PopularProductsController],
  providers: [PopularProductsService],
})
export class PopularProductsModule {}
