// src/popular-products/popular-products.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PopularProduct } from './schemas/popular-product.schema';
import { Food } from '../products/food/schemas/food.schema';
import { Beverage } from '../products/beverage/schemas/beverage.schema';

@Injectable()
export class PopularProductsService {
  constructor(
    @InjectModel(PopularProduct.name)
    private popularModel: Model<PopularProduct>,

    @InjectModel(Food.name)
    private foodModel: Model<Food>,

    @InjectModel(Beverage.name)
    private beverageModel: Model<Beverage>,
  ) {}

  async create(productId: string, productType: 'food' | 'beverage') {
    const objectId = new Types.ObjectId(productId);

    // VERIFY PRODUCT TYPE MATCHES REAL COLLECTION
    if (productType === 'food') {
      const food = await this.foodModel.findById(objectId);
      if (!food) {
        throw new BadRequestException('Product ID does not belong to Food');
      }
    }

    if (productType === 'beverage') {
      const beverage = await this.beverageModel.findById(objectId);
      if (!beverage) {
        throw new BadRequestException('Product ID does not belong to Beverage');
      }
    }

    try {
      return await this.popularModel.create({
        productId: objectId,
        productType,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new BadRequestException('Product already marked as popular');
      }
      throw err;
    }
  }

  async findAll() {
    const items = await this.popularModel.find().sort({ createdAt: -1 });
    return {
      total: items.length,
      items,
    };
  }

  async delete(id: string) {
    const deleted = await this.popularModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Popular product not found');
    return { message: 'Popular product removed' };
  }
}
