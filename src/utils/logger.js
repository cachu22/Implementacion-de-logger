import winston from "winston";

// Paso 1 - Comentado para hacer otro a partir del siguiente
// Primer paso configuramos un log con consola
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({
//             level: "http"
//         })
//     ]
// })

// Paso 2 - Agregamos más transporte// Se comenta para duplicar y hacer otro
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({
//             level: "http"
//         }),
//         new winston.transports.File({
//             filename: './errors.log',
//             level: 'warn'
//         })
//     ]
// })

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4
    },
    
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        debug: 'white'
    }
}

// Paso 3 - Agregando nuestro custom level
export const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning',
            format: winston.format.simple()
        })
    ]
});

// Middleware de loggers
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleString()}`);
    next();
};

// Información sobre la configuración del logger
logger.info('Logger configurado con niveles personalizados y transporte de archivo - src/utils/logger.js.');
logger.info('Logger configurado para registrar en consola y archivo de errores - src/utils/logger.js.');