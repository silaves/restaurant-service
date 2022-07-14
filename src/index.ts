import {config} from 'dotenv'
import mongoose, {ConnectOptions} from 'mongoose'
import containerConfiguration from '@app/container'
import logger from '@app/logger'

config()
const container = containerConfiguration()
const expressApp = container.cradle.express
const port = container.cradle.appConfig.port
const mongooseUrl: string = container.cradle.appConfig.dataBase.url!
const mongooseOptions = {
    retryWrites: true,
    w: 'majority',
}

mongoose.connect(mongooseUrl, mongooseOptions as ConnectOptions)
    .then( () => {
        logger.info('database connected')
        expressApp.listen(port, () => {
            logger.info(`starting server on port: ${port}`)
        });
    })
    .catch((error) => {
        logger.error(`failed to lunch database due to ${error}`)
    });
