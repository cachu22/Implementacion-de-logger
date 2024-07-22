import { CustomError } from "../service/errors/CustomError.js";
import { EError } from "../service/errors/enums.js";
import { addProductError } from "../service/errors/info.js";
import { ProductService } from "../service/index.js";
import { generateProducts } from "../utils/generateProductsMock.js";


class ProductController {
    constructor() {
        this.productService = ProductService;

        // Bind methods to ensure `this` refers to the instance of ProductController
        this.getAll = this.getAll.bind(this);
        this.getAllPaginated = this.getAllPaginated.bind(this);
        this.getProductsByCategory = this.getProductsByCategory.bind(this);
        this.getProductsAvailability = this.getProductsAvailability.bind(this);
        this.getProductsByPrice = this.getProductsByPrice.bind(this);
        this.getOne = this.getOne.bind(this);
        this.create = this.create.bind(this);
        this.put = this.put.bind(this);
        this.deleteDate = this.deleteDate.bind(this);
    }

    // Obtener todos los productos
    getAll = async ( req, res ) => {
        const products = await this.productService.getAll()
        res.send({status: 'success', payload: products})
    }

    //Traer productos paginados para el front
    getAllPaginated = async (req, res) => {
        try {
            const {
                limit,
                numPage,
                category,
                status,
                sortByPrice,
                order,
                explain,
                availability
            } = req.query;

            const parsedLimit = parseInt(limit, 9);
            const parsedNumPage = parseInt(numPage, 9);
            const parsedExplain = explain === 'true';
            // const parsedAvailability = availability === 'true';

            const products = await this.productService.getAllPaginated({
                limit: parsedLimit,
                numPage: parsedNumPage,
                category,
                status,
                sortByPrice,
                order,
                explain, parsedExplain,
                availability //parsedAvailability
            });
            // console.log('result de product.controller.js-getAllpaginated', products);
            res.send({ status: 'success', payload: products });
        } catch (error) {
            console.error(error);
            res.status(500).send({ status: 'error', message: 'Error al obtener todos los productos' });
        }
    };

    // Obtener producto por ID
    getOne = async (req, res) => {
        try {
            const productId = req.params.pid;
            if (!productId) {
                return res.status(400).json({ status: 'error', message: 'ID Erroneo' });
            }
            const product = await this.productService.getOne(productId);
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'product not found' });
            }
            console.log('datos', product);
            res.json({ status: 'success', payload: product });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }

    // Obtener productos por categoría
    getProductsByCategory = async (req, res) => {
        const category = req.params.category;
        try {
            const result = await this.productService.getAll({ category });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por categoría:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por categoría' });
        }
    };

    // Obtener productos por disponibilidad
    getProductsAvailability = async (req, res) => {
        const availability = req.params.availability === 'true';
        try {
            const result = await this.productService.getAll({ availability });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos por disponibilidad:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos por disponibilidad' });
        }
    };

    // Obtener productos ordenados por precio
    getProductsByPrice = async (req, res) => {
        const sortByPrice = req.params.sortByPrice === 'price' ? 'price' : null;
        const order = req.params.order === 'asc' ? 1 : req.params.order === 'desc' ? -1 : null;
    
        if (!sortByPrice || order === null) {
            return res.status(400).send({ status: 'error', message: 'Parámetros de ordenamiento no válidos' });
        }
    
        try {
            const result = await this.productService.getAll({ sortByPrice, order });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error('Error al obtener productos ordenados por precio:', error);
            res.status(500).send({ status: 'error', message: 'Error al obtener productos ordenados por precio' });
        }
    };

    // Crear un nuevo producto
    // create = async (req, res) => {
    //     try {
    //         const productData = req.body;
    //         const newProduct = await this.productService.create(productData);
    //         res.status(201).json({ status: 'true', payload: newProduct });
    //     } catch (error) {
    //         res.status(500).json({ status: 'error', message: 'Error al agregar un nuevo producto', error: error.message });
    //     }
    // };

    // create = async (req, res, next) => {
    //     try {
    //         const { title, model, description, price, thumbnails, stock, category } = req.body;
            
    //         if (
    //             !title || typeof title !== 'string' ||
    //             !model || typeof model !== 'string' ||
    //             !description || typeof description !== 'string' ||
    //             !price || typeof price !== 'number' ||
    //             !thumbnails || typeof thumbnails !== 'string' ||
    //             !stock || typeof stock !== 'number' ||
    //             !category || typeof category !== 'string'
    //         ) {
    //             return next(CustomError.createError({
    //                 name: 'ProductValidationError',
    //                 cause: addProductError(req.body),
    //                 message: 'Error al crear el producto',
    //                 code: EError.INVALID_TYPES_ERROR
    //             }));
    //         }

    //         const newProduct = await this.productService.create(req.body);
    //         res.status(201).json({ status: 'true', payload: newProduct });
    //     } catch (error) {
    //         next(error); // Pasar el error al middleware de manejo de errores
    //     }
    // };

    create = async (req, res) => {
        try {
            const { title, model, description, price, thumbnails, stock, category } = req.body;
    
            if (!title || !model || !description || !price || !thumbnails || !stock || !category) {
                CustomError.createError({
                    name: 'Error al agregar un producto',
                    cause: addProductError({ title, model, description, price, thumbnails, stock, category }),
                    message: 'Error al agregar el producto. Verifique los datos ingresados.',
                    code: EError.INVALID_TYPES_ERROR // Puedes definir este código en tu archivo enums.js
                });
            }
    
            const newProduct = {
                title,
                model,
                description,
                price,
                thumbnails,
                stock,
                category
            };
    
            const result = await this.productService.create(newProduct);
            res.status(201).json({ status: 'true', payload: result });
        } catch (error) {
            console.log(error);
        }
    };

    // Actualizar un producto
    put = async (req, res) => {
        const { pid } = req.params;
        const updatedProductData = req.body;
        try {
            const result = await this.productService.updateProduct(pid, updatedProductData);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al actualizar el producto', error: error.message });
        }
    };

    // Eliminar un producto
    deleteDate = async (req, res) => {
        const { pid } = req.params;
        try {
            const result = await this.productService.deleteProduct(pid);
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(500).send({ status: 'error', message: 'Error al eliminar el producto', error: error.message });
        }
    };

}

export default ProductController;