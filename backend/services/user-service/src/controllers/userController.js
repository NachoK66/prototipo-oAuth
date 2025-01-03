const User = require('../models/userModel');

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserByOAuthId = async (req, res) => {
    try {
        const user = await User.findOne({ oauthId : req.params.oauthId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user
const createUser = async (req, res) => {
    const user = new User({
        oauthId: req.body.oauthId,
        name: req.body.name,
        email: req.body.email
    });

    if(req.body.profilePicture)
        user.profilePicture = req.body.profilePicture;

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ oauthId : req.params.oauthId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ oauthId : req.params.oauthId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a user with oAuthId
const login = async (req, res) => {
    try {
        const user = await
            User.findOne({ oauthId :
                req.body.token });
        if (!user){
            console.log("User not found");
            return res.status(200).json();
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUsers,
    getUserByOAuthId,
    createUser,
    updateUser,
    deleteUser,
    login
};