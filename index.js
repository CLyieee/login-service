const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userController = require('./Routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get('/getall', userController.getAllUsers);
app.post('/create', userController.createUser);
app.put('/update', userController.updateUser);
app.delete('/delete/:id', userController.deleteUser);
app.post('/login', userController.loginUser);

mongoose.connect('mongodb://localhost:27017/user')
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(error => console.error('Database connection error:', error));
