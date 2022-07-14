import { Schema, Types } from 'mongoose';

export interface IRecipeDetail {
    product: Types.ObjectId,
    qty: number,
}

export const RecipeDetailSchema = new Schema<IRecipeDetail>(
    {
        product: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
        qty: {type: Number, required: true},
    },
    {
        timestamps: true,
    }
);
