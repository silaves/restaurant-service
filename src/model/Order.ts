import { HydratedDocument, Model, Query, Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import {IOrderDetail, OrderDetailSchema} from '@app/model/OrderDetail';

export enum OrderType {
    PENDING = 0,
    RECEIVED = 1,
    FINISHED = 2,
    CANCELED = 3
}

export interface IOrder {
    table: string,
    status: number,
    startDate: Date,
    endDate?: Date,
    details: [IOrderDetail],
}

type OrderModelType = Model<IOrder, OrderQueryHelpers>;
type OrderModelQuery = Query<any, HydratedDocument<IOrder>, OrderQueryHelpers> & OrderQueryHelpers;

interface OrderQueryHelpers {
    activeOne(this: OrderModelQuery): OrderModelQuery;
    actives(this: OrderModelQuery): OrderModelQuery;
}

const OrderSchema = new Schema<IOrder, OrderModelType, {}, OrderQueryHelpers>(
    {
        table: {type: String, required: true},
        status: {type: Number, required: true},
        startDate: {type: Date, required: true},
        endDate: {type: Date, required: false},
        details: {
            type: [OrderDetailSchema],
            required: true,
        }
    },
    {
        timestamps: true,
    },
);
OrderSchema.plugin(MongooseDelete, { deletedAt : true });

OrderSchema.query.activeOne = function(): OrderModelQuery {
    return this.findOne({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};
OrderSchema.query.actives = function(): OrderModelQuery {
    return this.find({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};

export default model<IOrder, OrderModelType>('Order', OrderSchema);
