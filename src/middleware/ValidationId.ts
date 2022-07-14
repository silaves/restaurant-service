import {NextFunction, Response, Request} from 'express';
import mongoose from 'mongoose'

export const ValidationId = (req: Request, res: Response, next: NextFunction) => {
    if (req.params.id) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({'message': 'Invalid Id'});
        }
    }
    return next();
}
