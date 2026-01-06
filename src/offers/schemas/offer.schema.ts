// src/offers/schemas/offer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, enum: ['food', 'beverage'] })
  productType: 'food' | 'beverage';

  @Prop({ required: true })
  offer: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  // expireAt is used by MongoDB TTL index to auto-delete expired offers
  @Prop()
  expireAt?: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

// ensure one offer per product (unique)
OfferSchema.index({ productId: 1 }, { unique: true });

// TTL index: Mongo will remove documents when expireAt <= now (expireAfterSeconds: 0)
OfferSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
