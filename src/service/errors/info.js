export const generateUserError = (user) => {
    return `Hay una de las propiedades del usuario incompleta o no valida.
    Listado de propiedades requeridos:
    *first_name: necesita ser un string, pero se recibió ${user.first_name}
    *last_name: necesita ser un string, pero se recibió ${user.last_name}
    *email: necesita ser un string, pero se recibió ${user.email}
    `;
}

export const addProductError = (newProduct) => {
    return `Uno de los campos es erroneo o no se encuentra.
    Los requerimientos son:
    *title: Necesita ser un string, pero se recibió ${newProduct.title}
    *model: Necesita ser un string, pero se recibió ${newProduct.model}
    *description: Necesita ser un string, pero se recibió ${newProduct.description}
    *price: Necesita ser un number, pero se recibió ${newProduct.price}
    *thumbnails: Necesita ser un string, pero se recibió ${newProduct.thumbnails}
    *stock: Necesita ser un number, pero se recibió ${newProduct.stock}
    *category: Necesita ser un string, pero se recibió ${newProduct.category}
    `;
}
// export const addProductError = () => {
//     return 
// }