import mongoose from 'mongoose'
import {Request, Response} from 'express';
import Product from '@app/model/Product'

export class ProductController {

    async create (req: Request, res: Response) {
        const {name, code} = req.body;
        let product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name,
            code,
        })
        product = await product.save();
        res.status(200).json(product);
    }

    async update (req: Request, res: Response) {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({'message': 'Not found'});
        }
        product.set(req.body);
        await product.save();
        return res.status(200).json(product);
    }

    async retrieve (req: Request, res: Response) {
        const productId = req.params.id;
        const product = await Product.findById(productId).activeOne();
        if (!product) {
            return res.status(404).json({'message': 'Not found'});
        }
        return res.status(200).json(product);
    }

    async retrieveAll (req: Request, res: Response) {
        const query = req.query.word;
        let filter = {};
        if (query) {
            filter = {name: {$regex: `.*${query}.*`, $options:'i'}};
        }

        const products = await Product.find(filter).actives();
        if (!products) {
            return res.status(404).json({'message': 'Not found'});
        }
        return res.status(200).json(products);
    }
}
