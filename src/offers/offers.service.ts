// src/offers/offers.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { Food } from '../products/food/schemas/food.schema';
import { Beverage } from '../products/beverage/schemas/beverage.schema';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
    @InjectModel(Food.name) private foodModel: Model<Food>,
    @InjectModel(Beverage.name) private beverageModel: Model<Beverage>,
  ) {}

  // Create or overwrite existing offer for same product (admin creates -> overwrite)
  async createOrReplace(data: {
    productId: string;
    productType: 'food' | 'beverage';
    offer: number;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
  }) {
    // validate product existence for productType
    const pid = new Types.ObjectId(data.productId);

    if (data.productType === 'food') {
      const ok = await this.foodModel.findById(pid);
      if (!ok) throw new BadRequestException('Product ID does not belong to a food item');
    } else {
      const ok = await this.beverageModel.findById(pid);
      if (!ok) throw new BadRequestException('Product ID does not belong to a beverage item');
    }

    if (data.startDate > data.endDate) {
      throw new BadRequestException('startDate must be before or equal to endDate');
    }

    const doc = {
      productId: pid,
      productType: data.productType,
      offer: data.offer,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive ?? true,
      expireAt: data.endDate, // TTL uses this
    };

    // upsert: if an offer exists for this product, it will be replaced
    const result = await this.offerModel.findOneAndUpdate(
      { productId: pid },
      doc,
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    );

    return result;
  }

  // Admin update by offer id
  async updateById(id: string, data: Partial<OfferDocument>) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid offer id');

    const existing = await this.offerModel.findById(id);
    if (!existing) throw new NotFoundException('Offer not found');

    // if productId/productType change — validate
    if (data.productId || data.productType) {
      const newPid = data.productId ? new Types.ObjectId(String(data.productId)) : existing.productId;
      const newType = data.productType ?? existing.productType;

      if (newType === 'food') {
        const ok = await this.foodModel.findById(newPid);
        if (!ok) throw new BadRequestException('productId does not belong to a food item');
      } else {
        const ok = await this.beverageModel.findById(newPid);
        if (!ok) throw new BadRequestException('productId does not belong to a beverage item');
      }

      // if changing productId ensure uniqueness (no other offer uses that product)
      const other = await this.offerModel.findOne({ productId: newPid, _id: { $ne: existing._id } });
      if (other) throw new BadRequestException('Another offer already exists for that product');
      existing.productId = newPid;
      existing.productType = newType;
    }

    if (data.offer !== undefined) existing.offer = data.offer;
    if (data.startDate) existing.startDate = new Date(String(data.startDate));
    if (data.endDate) {
      existing.endDate = new Date(String(data.endDate));
      existing.expireAt = new Date(String(data.endDate));
    }
    if (data.isActive !== undefined) existing.isActive = data.isActive;

    await existing.save();
    return existing;
  }

  // Delete offer by id
  async deleteById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid offer id');
    const deleted = await this.offerModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Offer not found');
    return { message: 'Offer deleted successfully' };
  }

  // Get all active offers (for users)
  async findAllActive() {
    const now = new Date();
    const items = await this.offerModel.find({
      isActive: true,
      endDate: { $gte: now },
    }).sort({ startDate: 1 });

    return {
      total: items.length,
      items,
    };
  }

  // Admin: get all offers regardless of active/expired
  async findAllAdmin() {
    const items = await this.offerModel.find().sort({ createdAt: -1 });
    return {
      total: items.length,
      items,
    };
  }

  // Get single offer by id (admin)
  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid offer id');
    const item = await this.offerModel.findById(id);
    if (!item) throw new NotFoundException('Offer not found');
    return item;
  }
}
