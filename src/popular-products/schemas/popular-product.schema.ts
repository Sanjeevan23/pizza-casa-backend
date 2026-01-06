//src/popular-products/schemas/popular-product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PopularProductDocument = PopularProduct & Document;

@Schema({ timestamps: true })
export class PopularProduct {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ enum: ['food', 'beverage'], required: true })
  productType: 'food' | 'beverage';
}

export const PopularProductSchema =
  SchemaFactory.createForClass(PopularProduct);

// Prevent duplicate popular products
PopularProductSchema.index(
  { productId: 1, productType: 1 },
  { unique: true },
);
