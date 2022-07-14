import { HydratedDocument, Model, Query, Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface IProduct {
    name: string,
    code?: string,
}

type ProductModelType = Model<IProduct, ProductQueryHelpers>;
type ProductModelQuery = Query<any, HydratedDocument<IProduct>, ProductQueryHelpers> & ProductQueryHelpers;

interface ProductQueryHelpers {
    activeOne(this: ProductModelQuery): ProductModelQuery;
    actives(this: ProductModelQuery): ProductModelQuery;
}

const schema = new Schema<IProduct, ProductModelType, {}, ProductQueryHelpers>(
    {
        name: {type: String, required: true},
        code: {type: String, required: false},
    },
    {
        timestamps: true,
    },
);
schema.plugin(MongooseDelete, { deletedAt : true });

schema.query.activeOne = function(): ProductModelQuery {
    return this.findOne({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};
schema.query.actives = function(): ProductModelQuery {
    return this.find({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};

export default model<IProduct, ProductModelType>('Product', schema);
