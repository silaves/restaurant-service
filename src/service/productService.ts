import Stock from '@app/model/Stock'

export class ProductService {
    constructor() {
    }

    public static async getCurrentStock (productId: string) {
        const stocks = await Stock.find({product: productId}).actives();
        let totalStock = 0;
        for (const stock of stocks) {
            totalStock += stock.qty;
        }
        return totalStock;
    }
}