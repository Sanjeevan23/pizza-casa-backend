//src/favourite-products/dto/create-favourite.dto.ts
import { IsEnum, IsMongoId } from 'class-validator';

export class CreateFavouriteDto {
    @IsMongoId()
    productId: string;

    @IsEnum(['food', 'beverage'])
    productType: 'food' | 'beverage';
}
