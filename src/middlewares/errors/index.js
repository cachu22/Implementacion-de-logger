import { EError } from "../../service/errors/enums.js";

export const handleErrors = () => (error, req, res, next) => {
    console.log(error.cause);

    let statusCode = 500; // Default to Internal Server Error
    let errorMessage = 'Error no identificado';

    switch (error.code) {
        case EError.INVALID_TYPES_ERROR:
            statusCode = 400; // Bad Request
            errorMessage = 'Tipo de datos inválido';
            break;
        case EError.DATABASE_ERROR:
            statusCode = 500; // Internal Server Error
            errorMessage = 'Error en la base de datos';
            break;
        default:
            errorMessage = 'Error sin motivo alguno xD';
            break;
    }

    res.status(statusCode).json({ status: 'error', error: errorMessage });
};