import {createLogger, transports, format} from "winston";
import {config} from 'dotenv';
config();

const transportConsole = new transports.Console({
    level: process.env.LOG_LEVEL,
});

const logger = createLogger({
    transports: [transportConsole],
    format: format.combine(format.timestamp(), format.json()),
});

export default logger;