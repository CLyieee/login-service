const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class UserService {
    async getAllUsers() {
        return userRepository.findAll();
    }

    async createUser(userData) {
        const { email, name } = userData;

        // Check if email or name already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const existingUserByName = await userRepository.findByName(name);
        if (existingUserByName) {
            throw new Error('Name already in use');
        }

        return userRepository.create(userData);
    }

    async updateUser(id, updateData) {
        const { email, name } = updateData;

        // Check if email or name already exists
        if (email) {
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser && existingUser._id.toString() !== id) {
                throw new Error('Email already in use');
            }
        }

        if (name) {
            const existingUserByName = await userRepository.findByName(name);
            if (existingUserByName && existingUserByName._id.toString() !== id) {
                throw new Error('Name already in use');
            }
        }

        return userRepository.update(id, updateData);
    }

    async deleteUser(id) {
        return userRepository.delete(id);
    }

    async loginUser(email, password) {
        const user = await userRepository.findByEmail(email);
        if (user && await user.comparePassword(password)) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            return { user, token };
        } else {
            throw new Error('Invalid credentials');
        }
    }
}

module.exports = new UserService();
