const userService = require('../service/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const data = await userService.getAllUsers();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        await userService.createUser(req.body);
        res.send({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id, ...rest } = req.body;
        const data = await userService.updateUser(id, rest);
        res.send({ success: true, message: 'Data updated successfully', data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await userService.deleteUser(id);
        res.send({ success: true, message: 'Data deleted successfully', data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const { user, token } = await userService.loginUser(email, password);
        res.json({ success: true, user, token });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};
