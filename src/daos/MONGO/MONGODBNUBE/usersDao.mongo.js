import mongoose from "mongoose";
import { userModel } from "../models/users.models.js";

class UserDaoMongo {
  async get(query) {
    if (typeof query === 'string') {
      if (!mongoose.Types.ObjectId.isValid(query)) {
        throw new Error('Invalid user ID');
      }
      return userModel.findOne({ _id: query });
    }
    return userModel.findOne(query);
  }

  async getOne(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

  async getOneInfo(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.findOne({ _id: id });
  }

  async getAll() {
    return userModel.find();
  }

  async create(user) {
    try {
        // Log para verificar el objeto antes de guardarlo en la base de datos
        console.log('Objeto que se guarda en la base de datos:', user);
        const newUser = await userModel.create(user);
        return newUser;
    } catch (error) {
        console.error('Error al crear el usuario en la base de datos:', error);
        throw error;
    }
}

  async update(id, userData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.updateOne({ _id: id }, { $set: userData });
  }

  async deleteData(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID');
    }
    return userModel.deleteOne({ _id: id });
  }
}

export default UserDaoMongo