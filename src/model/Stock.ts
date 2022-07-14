import { HydratedDocument, Model, Query, Schema, model, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

interface IStock {
    product: Types.ObjectId,
    qty: number,
    comment?: string,
}

type StockModelType = Model<IStock, StockQueryHelpers>;
type StockModelQuery = Query<any, HydratedDocument<IStock>, StockQueryHelpers> & StockQueryHelpers;

interface StockQueryHelpers {
    activeOne(this: StockModelQuery): StockModelQuery;
    actives(this: StockModelQuery): StockModelQuery;
}

const StockSchema = new Schema<IStock, StockModelType, {}, StockQueryHelpers>(
    {
        product: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
        qty: {type: Number, required: true},
        comment: {type: String, required: false},
    },
    {
        timestamps: true,
    }
);
StockSchema.plugin(MongooseDelete, { deletedAt : true });

StockSchema.query.activeOne = function(): StockModelQuery {
    return this.findOne({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};
StockSchema.query.actives = function(): StockModelQuery {
    return this.find({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};

export default model<IStock, StockModelType>('Stock', StockSchema);
