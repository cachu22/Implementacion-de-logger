import UserDto from "../dtos/users.dto.js";
import { logger } from "../utils/logger.js";

export default class UserRepository {
    constructor(userDao) {
        this.userDao = userDao;
    }

    getUsers = async () => {
        const users = await this.userDao.getAll();
        return users.map(user => new UserDto(user));
    }

    getUser = async (filter) => {
        const user = await this.userDao.getOne(filter);
        logger.info('Usuario en getUser - user.repository - src/repositories/user.repository.js', user); // Log info
        return user;
    }

    getUserInfo = async (filter) => {
        const user = await this.userDao.getOneInfo(filter);
        return user ? new UserDto(user) : null;
    }

    createUser = async (user) => {
        const newUser = new UserDto(user);
        const createdUser = await this.userDao.create(newUser);
        logger.info('Usuario creado - user.repository - src/repositories/user.repository.js', createdUser); // Log info
        return createdUser;
    }

    updateUser = async (uid, userToUpdate) => {
        if (userToUpdate.first_name || userToUpdate.last_name) {
            userToUpdate.fullname = `${userToUpdate.first_name || ''} ${userToUpdate.last_name || ''}`.trim();
        }
        const updatedUser = await this.userDao.update(uid, userToUpdate);
        logger.info('Usuario actualizado - user.repository - src/repositories/user.repository.js', updatedUser); // Log info
        return updatedUser ? new UserDto(updatedUser) : null;
    }

    deleteUser = async (uid) => {
        const deletedUser = await this.userDao.delete(uid);
        logger.info('Usuario eliminado - user.repository - src/repositories/user.repository.js', deletedUser); // Log info
        return deletedUser ? new UserDto(deletedUser) : null;
    }
}