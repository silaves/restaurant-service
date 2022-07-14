import mongoose from 'mongoose'
import Product from '@app/model/Product'
import Recipe from '@app/model/Recipe'

export class RecipeService {
    constructor() {
    }

    public static async existProduct (productId: string) {
        if (!await mongoose.Types.ObjectId.isValid(productId)) {
            return false;
        }
        const product = await Product.findById(productId).activeOne();
        if (!product) {
            return false;
        }
        return true;
    }

    public static async existRecipe (recipeId: string) {
        if (!await mongoose.Types.ObjectId.isValid(recipeId)) {
            return false;
        }
        const recipe = await Recipe.findById(recipeId).activeOne();
        if (!recipe) {
            return false;
        }
        return true;
    }
}