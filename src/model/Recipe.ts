import { HydratedDocument, Model, Query, Schema, model, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import {RecipeDetailSchema, IRecipeDetail} from '@app/model/RecipeDetail'

export interface IRecipe {
    product: Types.ObjectId,
    details: [IRecipeDetail],
}

type RecipeModelType = Model<IRecipe, RecipeQueryHelpers>;
type RecipeModelQuery = Query<any, HydratedDocument<IRecipe>, RecipeQueryHelpers> & RecipeQueryHelpers;

interface RecipeQueryHelpers {
    activeOne(this: RecipeModelQuery): RecipeModelQuery;
    actives(this: RecipeModelQuery): RecipeModelQuery;
}

const RecipeSchema = new Schema<IRecipe, RecipeModelType, {}, RecipeQueryHelpers>(
    {
        product: {type: Schema.Types.ObjectId, required: true, ref: 'Product'},
        details: {
            type: [RecipeDetailSchema],
            required: true,
        }
    },
    {
        timestamps: true,
    },
);
RecipeSchema.plugin(MongooseDelete, { deletedAt : true });

RecipeSchema.query.activeOne = function(): RecipeModelQuery {
    return this.findOne({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};
RecipeSchema.query.actives = function(): RecipeModelQuery {
    return this.find({
        $or:[
            {deleted: { $exists:false }}, {deleted:false}
        ]
    });
};

export default model<IRecipe, RecipeModelType>('Recipe', RecipeSchema);
