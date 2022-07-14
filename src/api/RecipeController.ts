import mongoose from 'mongoose';
import {Request, Response} from 'express';
import Recipe from '@app/model/Recipe'
import Product from '@app/model/Product';


interface IRequestRecipeDetail {
    product: string,
    qty: number,
}

export class RecipeController {

    async create (req: Request, res: Response) {
        const {product, details} = req.body;
        details.forEach((item: IRequestRecipeDetail) => {
            if (item.product === product) {
                return res.status(404).json({'message': 'Product detail cannot assign to recipe'});
            }
        });
        let recipe = new Recipe({
            _id: new mongoose.Types.ObjectId(),
            product,
        });

        for (const item of details) {
            recipe.details.push({
                product: item.product,
                qty: item.qty,
            });
        }
        recipe = await recipe.save();
        return res.status(200).json(recipe);
    }

    async update (req: Request, res: Response) {
        const {product, details} = req.body;
        let recipe = await Recipe.findById(req.params.id).activeOne();
        if (!recipe) {
            return res.status(404).json({'message': 'Not found'});
        }
        recipe.details = [];
        details.forEach((item: IRequestRecipeDetail) => {
            if (item.product === product) {
                return res.status(404).json({'message': 'Product detail cannot assign to recipe'});
            }
        });

        for (const item of details) {
            recipe.details.push({
                product: item.product,
                qty: item.qty,
            });
        }
        recipe = await recipe.save();
        return res.status(200).json(recipe);
    }

    async retrieve (req: Request, res: Response) {
        const recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId).activeOne().populate('product').populate('details.product');
        if (!recipe) {
            return res.status(404).json({'message': 'Not found'});
        }
        return res.status(200).json(recipe);
    }

    async retrieveAll (req: Request, res: Response) {
        const recipes = await Recipe.find().actives().populate('product').populate('details.product');
        if (!recipes) {
            return res.status(404).json({'message': 'Not found'});
        }
        return res.status(200).json(recipes);
    }

    async retrieveAllFilter (req: Request, res: Response) {
        const query = req.query.word;
        if (query) {
            const filter = {name: {$regex: `.*${query}.*`, $options:'i'}};
            const products = await Product.find(filter).actives();
            let idProducts = products.map((item: any) => item._id);
            const filterRecipe = {product: {$in: idProducts}};
            const recipes = await Recipe.find(filterRecipe).actives().populate('product');
            return res.status(200).json(recipes);
        } else {
            return res.status(200).json([]);
        }
    }
}
