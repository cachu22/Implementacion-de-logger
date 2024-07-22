 import mongoose from "mongoose";
 import { productModel } from "../models/products.models.js";

class ProductDaosMongo {
    constructor() {
        this.productModel = productModel;
    }

    // Traer todos los productos con filtrado y ordenamiento 
    async getAll(){ 
        return await this.productModel.find({})
    }

    // Traer todos los productos con filtrado y ordenamiento
    async getAllPaginated({ limit = 9, numPage = 1, category, status, sortByPrice, order, explain = false, availability }) {
        try {
            let filter = {};
            if (category) filter.category = category;
            if (availability !== undefined) filter.availability = availability;

            let sort = {};
            if (sortByPrice && order) {
                sort.price = order;
            }

            let query = await this.productModel.paginate(
                filter,
                { 
                    limit, 
                    page: numPage, 
                    sort,
                    lean: true 
                }
            );

            if (explain) {
                return await query.explain('executionStats');
            }

            return query;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    // Buscar producto por su IDcc
    async getOne(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error('Invalid product ID');
        }
        return productModel.findOne({ _id: id });
      }

    async create(productData) {
        try {
            const existingProduct = await this.productModel.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error('El código ' + productData.code + ' ya está siendo utilizado por otro producto. Por favor, elija otro código.');
            }
            return await this.productModel.create(productData);
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
            throw new Error('Error al agregar un nuevo producto: ' + error.message);
        }
    }

    async update(productId, updatedFields) {
        try {
            return await this.productModel.findByIdAndUpdate(productId, updatedFields, { new: true });
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async delete(productId) {
        try {
            return await this.productModel.findByIdAndDelete(productId);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }
}

export default ProductDaosMongo