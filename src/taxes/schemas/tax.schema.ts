// src/taxes/schemas/tax.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaxDocument = Tax & Document;

@Schema({ timestamps: true })
export class Tax {
  // 'food' | 'beverage' | 'all'
  @Prop({ required: true, enum: ['food', 'beverage', 'all'], default: 'all', unique: true })
  appliesTo: 'food' | 'beverage' | 'all';

  @Prop({ required: true })
  tax: number; // percentage or absolute value depending on front-end convention

  // optional human readable name (e.g. VAT). If provided, must be unique.
  @Prop({ type: String, unique: true, sparse: true })
  name?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);

// Notes:
// - unique on appliesTo ensures only one tax per appliesTo (so 'all' can only have one).
// - unique + sparse on name: name uniqueness enforced only when name is provided.
