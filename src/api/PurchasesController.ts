import {Request, Response} from 'express'
import {PurchaseService} from '@app/service/purchaseService'
import Product from '@app/model/Product'

let _purchaseService: any = null;

export class PurchasesController {

    constructor({purchaseService}: {purchaseService: PurchaseService}) {
        _purchaseService = purchaseService;
    }

    async purchase(req: Request, res: Response) {
        const productId = req.params.id;
        const qty = req.body.qty;
        const product = await Product.findById(productId).activeOne();
        if (!product) {
            return res.status(404).json({'message': 'Not found'});
        }
        await _purchaseService.addStock([{
            product: productId,
            qty: qty,
        }]);
        return res.status(200).json({'message': `${qty} quantities purchased`});
    }

    async purchaseFromMarket(req: Request, res: Response) {
        const productId = req.params.id;
        const product = await Product.findById(productId).activeOne();
        if (!product) {
            return res.status(404).json({'message': 'Not found'});
        }
        const value = await _purchaseService.purchaseFromFarmerMarket(product.code);
        if (value === 0) {
            return res.status(422).json({'message': 'Not available in the market'});
        }
        await _purchaseService.addStock([{
            product: productId,
            qty: value,
        }])
        return res.status(200).json({'purchased': value});
    }
}
