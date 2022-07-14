import {Schema, Types} from 'mongoose';

export enum OrderDetailType {
    PENDING = 0,
    RECEIVED = 1,
}

export interface IOrderDetail {
    recipe: Types.ObjectId,
    status: number,
    qty: number,
}

export const OrderDetailSchema = new Schema<IOrderDetail>(
    {
        recipe: {type: Schema.Types.ObjectId, required: true, ref: 'Recipe'},
        status: {type: Number, required: true},
        qty: {type: Number, required: true},
    },
    {
        timestamps: true,
    },
);
