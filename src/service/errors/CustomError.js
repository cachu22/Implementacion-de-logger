export class CustomError {
    static createError({name='Error', cause, message, code=1}){
        const error = new Error(message)
        error.name = name
        error.code = code
        error.cause = cause
        throw error
    }
}

//Error para los carritos
export const CART_ERROR_CODE = 3;