const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');
const bcrypt = require('bcrypt');
const saltFactor = 10;

const JWT_SECRET = process.env.JWT_SECRET || 'abcd1234!';

class UserService {
  async getAllUsers() {
    try {
      return await userRepository.findAll();
    } catch (error) {
      console.error('Error fetching users:', error.message);
      console.error(error.stack);
      throw new Error('Error fetching users');
    }
  }

  async createUser(userData) {
    try {
      const { name, email, gender, password } = userData;
      const hashedPassword = await bcrypt.hash(password, saltFactor);

      // Check if email already exists
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Create user with hashed password
      const user = await userRepository.create({ name, email, gender, password: hashedPassword });
      return { message: "SUCCESS USER REGISTER", user }; // Return user data

    } catch (error) {
      console.error('Error creating user:', error.message);
      console.error(error.stack);
      throw new Error('Error creating user');
    }
  }

  async updateUser(id, updateData) {
    try {
      const { email, name, password } = updateData;

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

      if (password) {
        updateData.password = await bcrypt.hash(password, saltFactor); // Ensure the password is hashed
      }

      return await userRepository.update(id, updateData);
    } catch (error) {
      console.error('Error updating user:', error.message);
      console.error(error.stack);
      throw new Error('Error updating user');
    }
  }

  async deleteUser(id) {
    try {
      return await userRepository.delete(id);
    } catch (error) {
      console.error('Error deleting user:', error.message);
      console.error(error.stack);
      throw new Error('Error deleting user');
    }
  }

  async loginUser(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = await userRepository.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) { // Ensure password comparison
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in user:', error.message);
      console.error(error.stack);
      throw new Error('Error logging in user');
    }
  }
}

module.exports = new UserService();
