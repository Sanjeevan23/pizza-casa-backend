// src/offers/offers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Offer, OfferSchema } from './schemas/offer.schema';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Food, FoodSchema } from '../products/food/schemas/food.schema';
import { Beverage, BeverageSchema } from '../products/beverage/schemas/beverage.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: Food.name, schema: FoodSchema },
      { name: Beverage.name, schema: BeverageSchema },
    ]),
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
