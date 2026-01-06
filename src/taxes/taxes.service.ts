// src/taxes/taxes.service.ts
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tax, TaxDocument } from './schemas/tax.schema';

@Injectable()
export class TaxesService {
  constructor(
    @InjectModel(Tax.name) private taxModel: Model<TaxDocument>,
  ) {}

  // Create a tax — rules:
  // - only one tax per appliesTo value (unique appliesTo index enforces at DB level)
  // - name (if provided) must be unique (sparse unique index)
  async create(data: Partial<Tax>): Promise<Tax> {
    // Normalize appliesTo default
    const appliesTo = data.appliesTo ?? 'all';

    // Basic validation before hitting DB
    if (data.tax === undefined || data.tax === null) {
      throw new BadRequestException('tax is required');
    }

    // Try create; catch dup key and return friendly error
    try {
      const doc = new this.taxModel({
        appliesTo,
        tax: data.tax,
        name: data.name ?? undefined,
        isActive: data.isActive ?? true,
      });
      return await doc.save();
    } catch (err: any) {
      // duplicate key
      if (err.code === 11000) {
        // check which key caused error
        if (err.keyPattern && err.keyPattern.appliesTo) {
          throw new ConflictException(`A tax for appliesTo='${appliesTo}' already exists`);
        }
        if (err.keyPattern && err.keyPattern.name) {
          throw new ConflictException(`A tax with name='${data.name}' already exists`);
        }
      }
      throw err;
    }
  }

  // Get all taxes (returns count and items)
  async findAll(): Promise<{ total: number; items: Tax[] }> {
    const items = await this.taxModel.find().sort({ appliesTo: 1 });
    return { total: items.length, items };
  }

  // Find by id
  async findById(id: string): Promise<Tax> {
    const t = await this.taxModel.findById(id);
    if (!t) throw new NotFoundException('Tax not found');
    return t;
  }

  // Update tax by id — enforces unique constraints and friendly errors
  async updateById(id: string, data: Partial<Tax>): Promise<Tax> {
    const existing = await this.taxModel.findById(id);
    if (!existing) throw new NotFoundException('Tax not found');

    // If changing appliesTo, ensure not colliding with another tax
    if (data.appliesTo && data.appliesTo !== existing.appliesTo) {
      const other = await this.taxModel.findOne({ appliesTo: data.appliesTo });
      if (other) {
        throw new ConflictException(`A tax for appliesTo='${data.appliesTo}' already exists`);
      }
      existing.appliesTo = data.appliesTo as any;
    }

    // If changing name, ensure uniqueness
    if (data.name && data.name !== existing.name) {
      const other = await this.taxModel.findOne({ name: data.name });
      if (other) {
        throw new ConflictException(`A tax with name='${data.name}' already exists`);
      }
      existing.name = data.name;
    }

    if (data.tax !== undefined) existing.tax = data.tax as any;
    if (data.isActive !== undefined) existing.isActive = data.isActive;

    await existing.save();
    return existing;
  }

  // Delete tax
  async deleteById(id: string) {
    const deleted = await this.taxModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Tax not found');
    return { message: 'Tax deleted successfully' };
  }
}
