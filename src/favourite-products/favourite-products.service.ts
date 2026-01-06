// src/favourite-products/favourite-products.service.ts
import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FavouriteProduct } from './schemas/favourite-products.schema';
import { Food } from '../products/food/schemas/food.schema';
import { Beverage } from '../products/beverage/schemas/beverage.schema';
import { CreateFavouriteDto } from './dto/create-favourite.dto';

@Injectable()
export class FavouriteProductsService {
    constructor(
        @InjectModel(FavouriteProduct.name)
        private favModel: Model<FavouriteProduct>,

        @InjectModel(Food.name)
        private foodModel: Model<Food>,

        @InjectModel(Beverage.name)
        private beverageModel: Model<Beverage>,
    ) { }

    async addFavourite(userId: string, dto: CreateFavouriteDto) {
        // Validate IDs
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }
        if (!Types.ObjectId.isValid(dto.productId)) {
            throw new BadRequestException('Invalid productId');
        }

        const userObjectId = new Types.ObjectId(userId);
        const productObjectId = new Types.ObjectId(dto.productId);

        // Validate product exists in the correct collection
        if (dto.productType === 'food') {
            const food = await this.foodModel.findById(productObjectId);
            if (!food) {
                throw new BadRequestException('Product ID does not belong to a food item');
            }
        } else {
            const beverage = await this.beverageModel.findById(productObjectId);
            if (!beverage) {
                throw new BadRequestException('Product ID does not belong to a beverage item');
            }
        }

        // Prevent duplicates (safe double-check before insert)
        const exists = await this.favModel.findOne({
            userId: userObjectId,
            productId: productObjectId,
        });
        if (exists) {
            throw new BadRequestException('Already added to favourites');
        }

        // Create favourite
        return this.favModel.create({
            userId: userObjectId,
            productId: productObjectId,
            productType: dto.productType,
        });
    }

    async removeFavourite(userId: string, productId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }

        if (!Types.ObjectId.isValid(productId)) {
            throw new BadRequestException('Invalid productId');
        }

        const result = await this.favModel.findOneAndDelete({
            userId: new Types.ObjectId(userId),
            productId: new Types.ObjectId(productId),
        });

        //  IMPORTANT: confirm deletion
        if (!result) {
            throw new NotFoundException('Favourite product not found');
        }

        return { message: 'Removed from favourites' };
    }

    async getUserFavourites(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }

        const items = await this.favModel
            .find({ userId: new Types.ObjectId(userId) })
            .sort({ createdAt: -1 });

        return {
            total: items.length,
            items,
        };
    }
}
