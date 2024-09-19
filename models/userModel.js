const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//     if (this.isModified('password') || this.isNew) {
//         try {
//             this.password = await bcrypt.hash(this.password, 10);
//             next();
//         } catch (error) {
//             next(error);
//         }
//     } else {
//         next();
//     }
// });


userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

module.exports = mongoose.model('User', userSchema);