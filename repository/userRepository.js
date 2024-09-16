const User = require('../models/userModel');

class UserRepository {
    async findAll() {
        return User.find({});
    }

    async create(userData) {
        const user = new User(userData);
        return user.save();
    }

    async update(id, updateData) {
        return User.updateOne({ _id: id }, updateData);
    }

    async delete(id) {
        return User.deleteOne({ _id: id });
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async findByName(name) {
        return User.findOne({ name });
    }
}

module.exports = new UserRepository();
