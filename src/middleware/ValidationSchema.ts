import Joi, {ObjectSchema} from 'joi';
import {NextFunction, Response, Request} from 'express';
import logger from "@app/logger";
import {RecipeService} from '@app/service/recipeService'


export const ValidationSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
            return next();
        } catch (error) {
            logger.error(error);
            return res.status(422).json({error});
        }
    }
}

const lookup = async (value: any) => {
    const exist = await RecipeService.existProduct(value);
    if (!exist) {
        throw new Error('Invalid Id');
    }
}

const lookupRecipe = async (value: any) => {
    const exist = await RecipeService.existRecipe(value);
    if (!exist) {
        throw new Error('Invalid Id');
    }
}

export const Schemas = {
    product: {
        create: Joi.object({
            name: Joi.string().required(),
            code: Joi.string().required(),
        }),
        update: Joi.object({
            name: Joi.string(),
            code: Joi.string(),
        })
    },
    recipe: {
        create: Joi.object({
            product: Joi.string().external(lookup).required(),
            details: Joi.array().min(1).items(Joi.object({
                product: Joi.string().external(lookup).required(),
                qty: Joi.number().integer().min(1).required(),
            })).required(),
        }),
        update: Joi.object({
            product: Joi.string().external(lookup).required(),
            details: Joi.array().min(1).items(Joi.object({
                product: Joi.string().external(lookup).required(),
                qty: Joi.number().integer().min(1).required(),
            })).required(),
        }),
    },
    order: {
        simpleCreate: Joi.object({
            table: Joi.string().required(),
            qty: Joi.number().integer().min(1).required(),
        }),
        create: Joi.object({
            table: Joi.string().required(),
            details: Joi.array().min(1).items(Joi.object({
                recipe: Joi.string().external(lookupRecipe).required(),
                qty: Joi.number().integer().min(1).required(),
            })).required(),
        }),
        bulkCreate: Joi.object({
            orders: Joi.array().min(0).items(Joi.object({
                table: Joi.string().required(),
                details: Joi.array().min(1).items(Joi.object({
                    recipe: Joi.string().external(lookupRecipe).required(),
                    qty: Joi.number().integer().min(1).required(),
                })).required(),
            })),
        }),
        update: Joi.object({
            table: Joi.string().required(),
            details: Joi.array().min(1).items(Joi.object({
                recipe: Joi.string().external(lookupRecipe).required(),
                qty: Joi.number().integer().min(1).required(),
            })).required(),
        }),
    },
    purchase: {
        purchase: Joi.object({
            qty: Joi.number().integer().min(1).required(),
        }),
    },
}