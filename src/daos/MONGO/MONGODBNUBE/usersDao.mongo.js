import mongoose from "mongoose";
import { userModel } from "../models/users.models.js";
import { logger } from "../../../utils/logger.js";

class UserDaoMongo {
  async get(query) {
    if (typeof query === 'string') {
      if (!mongoose.Types.ObjectId.isValid(query)) {
        logger.error('ID de usuario inválido - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', query);
        throw new Error('Invalid user ID');
      }
      return userModel.findOne({ _id: query });
    }
    return userModel.findOne(query);
  }

  async getOne(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('ID de usuario inválido - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', id);
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

  async getOneInfo(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('ID de usuario inválido - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', id);
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

  async getAll() {
    try {
      const users = await userModel.find();
      logger.info('Usuarios obtenidos con éxito - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', users);
      return users;
    } catch (error) {
      logger.error('Error al obtener todos los usuarios - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', error.message);
      throw error;
    }
  }

  async create(user) {
    try {
      // Log para verificar el objeto antes de guardarlo en la base de datos
      logger.info('Objeto que se guarda en la base de datos - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', user);
      const newUser = await userModel.create(user);
      logger.info('Usuario creado con éxito - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', newUser);
      return newUser;
    } catch (error) {
      logger.error('Error al crear el usuario en la base de datos - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', error.message);
      throw error;
    }
  }

  async update(id, userData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('ID de usuario inválido - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', id);
      throw new Error('Invalid user ID');
    }
    try {
      const result = await userModel.updateOne({ _id: id }, { $set: userData });
      logger.info('Usuario actualizado con éxito - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', result);
      return result;
    } catch (error) {
      logger.error('Error al actualizar el usuario - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', error.message);
      throw error;
    }
  }

  async deleteData(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      logger.error('ID de usuario inválido - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', id);
      throw new Error('Invalid user ID');
    }
    try {
      const result = await userModel.deleteOne({ _id: id });
      logger.info('Usuario eliminado con éxito - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', result);
      return result;
    } catch (error) {
      logger.error('Error al eliminar el usuario - Log de /src/daos/MONGO/MONGODBNUBE/usersDao.mongo.js:', error.message);
      throw error;
    }
  }
}

export default UserDaoMongo;