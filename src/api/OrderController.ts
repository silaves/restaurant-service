import {Request, Response} from 'express';
import mongoose from 'mongoose';
import Order, {OrderType} from '@app/model/Order';
import {OrderService} from '@app/service/orderService'
import {OrderDetailType} from '@app/model/OrderDetail'

export class OrderController {

    async randomCreate (req: Request, res: Response) {
        const {table, qty} = req.body;
        const order = await OrderService.generateRandomOrder(table, qty);
        return res.status(200).json(order);
    }

    async create (req: Request, res: Response) {
        const {table, details} = req.body;
        let order = new Order({
            _id: new mongoose.Types.ObjectId(),
            table: table,
            status: OrderType.PENDING,
            startDate: Date.now(),
        });
        for (const detail of details) {
            detail.status = OrderDetailType.PENDING;
        }
        order.details = details;
        order = await order.save();
        return res.status(200).json(order);
    }

    async bulkCreate (req: Request, res: Response) {
        const {orders} = req.body;
        let orderData = [];
        for (const item of orders) {
            let order = new Order({
                _id: new mongoose.Types.ObjectId(),
                table: item.table,
                status: OrderType.PENDING,
                startDate: Date.now(),
            });
            item.details.map((item: any) => {
                return {...item, status: OrderDetailType.PENDING}
            });
            order.details = item.details;
            orderData.push(order);
        }
        await Order.insertMany(orderData);
        return res.status(200).json({'length_orders': orderData.length});
    }

    async update (req: Request, res: Response) {
        let order = await Order.findById(req.params.id).activeOne();
        if (!order) {
            return res.status(404).json({'message': 'Not found'});
        }
        order.set(req.body);
        order = await order.save();
        return res.status(200).json(order);
    }

    async retrieve (req: Request, res: Response) {
        const orderId = req.params.id;
        let order = await Order.findById(orderId).activeOne().populate({
            path: 'details.recipe', populate: {path: 'product'}
        }).populate({
            path: 'details.recipe', populate: {path: 'details.product'}
        });
        if (!order) {
            return res.status(404).json({'message': 'Not found'});
        }
        return res.status(200).json(order);
    }

    async retrieveAll (req: Request, res: Response) {
        const valueFilter = req.query.status;
        let filter = {};
        if (valueFilter) {
            switch (valueFilter.toString()) {
                case OrderType.PENDING.toString():
                    filter = {status: OrderType.PENDING}
                    break
                case OrderType.FINISHED.toString():
                    filter = {status: OrderType.FINISHED}
                    break
                case OrderType.CANCELED.toString():
                    filter = {status: OrderType.CANCELED}
                    break
                default:
                    filter = {};
            }
        }

        const orders = await Order.find(filter).actives().populate({
            path: 'details.recipe', populate: {path: 'product'}
        }).populate({
            path: 'details.recipe', populate: {path: 'details.product'}
        }).sort({startDate: -1});
        if (!orders) {
            return res.status(404).json({'message': 'Not found'})
        }
        return res.status(200).json(orders);
    }

    async cancel (req: Request, res: Response) {
        let order = await Order.findById(req.params.id).activeOne();
        if (!order) {
            return res.status(404).json({'message': 'Not found'});
        }
        order.status = OrderType.CANCELED;
        await order.save();
        return res.status(200).json({'message': 'successful'});
    }

    async orderDetailReceived (req: Request, res: Response) {
        const orderDetailId = req.params.id;
        let order = await Order.findOne({
            'details._id': orderDetailId
        }).activeOne();

        if (!order) {
            return res.status(404).json({'message': 'Not found'});
        }
        if (!await OrderService.validateSupplies(orderDetailId)) {
            return res.status(422).json({'message': 'No supplies available'});
        }
        await Order.updateOne(
            {'details._id': orderDetailId},
            {
                '$set': {
                    'details.$.status': OrderDetailType.RECEIVED
                }
            }
        );
        await OrderService.updateStock(orderDetailId);
        return res.status(200).json({'message': 'successful'});
    }

    async finalize (req: Request, res: Response) {
        let order = await Order.findById(req.params.id).activeOne();
        if (!order) {
            return res.status(404).json({'message': 'Not found'});
        }
        order.status = OrderType.FINISHED;
        order.endDate = Date.now();
        await order.save();
        return res.status(200).json({'message': 'successful'});
    }
}
