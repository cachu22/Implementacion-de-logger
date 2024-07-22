export const generateUserError = (user) => {
    return `Hay una de las propiedades del usuario incompleta o no valida.
    Listado de propiedades requeridos:
    *first_name: necesita ser un string, pero se recibió ${user.first_name}
    *last_name: necesita ser un string, pero se recibió ${user.last_name}
    *email: necesita ser un string, pero se recibió ${user.email}
    `;
}

export const addProductError = (Product) => {
    return `Uno de los campos es erroneo o no se encuentra.
    Los requerimientos son:
    *title: Necesita ser un string, pero se recibió ${Product.title}
    *model: Necesita ser un string, pero se recibió ${Product.model}
    *description: Necesita ser un string, pero se recibió ${Product.description}
    *price: Necesita ser un number, pero se recibió ${Product.price}
    *thumbnails: Necesita ser un string, pero se recibió ${Product.thumbnails}
    *stock: Necesita ser un number, pero se recibió ${Product.stock}
    *category: Necesita ser un string, pero se recibió ${Product.category}
    `;
}

export const addProductToCartError = (productId, cartId, errorDetails) => {
    return `Error al agregar el producto con ID ${productId} al carrito con ID ${cartId}.
    Detalles del error: ${errorDetails}`;
}