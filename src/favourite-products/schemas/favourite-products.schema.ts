//src/favourite-products/schemas/favourite-products.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class FavouriteProduct extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    productId: Types.ObjectId;

    @Prop({ required: true, enum: ['food', 'beverage'] })
    productType: 'food' | 'beverage';
}

export const FavouriteProductSchema =
    SchemaFactory.createForClass(FavouriteProduct);

// Prevent duplicates
FavouriteProductSchema.index(
    { userId: 1, productId: 1 },
    { unique: true },
);
