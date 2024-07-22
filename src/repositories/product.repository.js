    import ProductDto from "../dtos/products.dto.js";

export default class ProductRepository {
    constructor(productDao) {
        this.productDao = productDao;
    }

    // Obtener todos los productos
    getAll = async () => await this.productDao.getAll()

    // Obtener todos los productos con filtros
    getAllPaginated = async (filters) => {
        const products = await this.productDao.getAllPaginated(filters);
        // console.log('log de products en product.repository.js - getAllPaginated', products);
        return products;
    };

    // Obtener un producto por ID
    getOne = async (filter) => {
        const product = await this.productDao.getOne(filter);
        console.log('Producto encontrado en product.repository-getById', product);
        return product
    }

    // Crear un nuevo producto
    create = async (productData) => {
        const newProduct = await this.productDao.create(productData);
        return new ProductDto(newProduct);
    };

    // Actualizar un producto
    update = async (id, productData) => {
        const updatedProduct = await this.productDao.update(id, productData);
        return new ProductDto(updatedProduct);
    };

    // Eliminar un producto
    delete = async (id) => {
        const result = await this.productDao.delete(id);
        return result;
    };
}
