const User = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");
const { get } = require('mongoose');

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
        const user = await User.findOne({ oauthId: req.params.oauthId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
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

    if (req.body.profilePicture)
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
        const user = await User.findOne({ oauthId: req.params.oauthId });
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
        const user = await User.findOne({ oauthId: req.params.oauthId });
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
        const { token } = req.body;
        // Decodificar el token para obtener los datos necesarios
        const decodedToken = jwt.decode(token);

        // Intentar encontrar el usuario en la base de datos
        let user = await User.findOne({ oauthId: decodedToken.sub });

        // Si el usuario no existe, crear uno nuevo
        if (!user) {
            console.log("Usuario no encontrado con oauthId: " + token);

            // Crear un nuevo usuario
            user = new User({
                oauthId: decodedToken.sub,
                name: decodedToken.name,
                email: decodedToken.email,
                profilePicture: decodedToken.picture
            });

            // Guardar el nuevo usuario en la base de datos
            await user.save();
            console.log("Usuario creado: ", user);
        }

        // Crear el payload para el token JWT
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture
        };

        // Generar el token JWT con caducidad de 7 dias
        const tokenJwt = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Enviar el usuario y el token como respuesta
        res.status(200).json({ user, customToken: tokenJwt });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Validate a token
const validateToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Decodificar y verificar el token
        console.log("Validando token: " + token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token: " + JSON.stringify(decoded));

        console.log("Buscando user ID: " + decoded.id);

        // Verifica si el usuario existe en la base de datos
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ valid: false, message: "Usuario no encontrado." });
        }

        console.log("User encontrado: " + JSON.stringify(user));
        // Token válido, devuelve datos del usuario
        res.status(200).json({ valid: true, user });

    } catch (err) {
        // Token inválido o expirado
        console.log("Token inválido o caducado: " + err);
        res.status(401).json({ valid: false, message: "Token inválido o caducado." });
    }
};

// Renew a token
const renewToken = async (req, res) => {
    const { token } = req.body;

    try {
        // Verificar y decodificar el token original
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Crear un nuevo token con los mismos datos pero con nueva expiración
        const payload = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
        };

        const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Enviar el nuevo token al cliente
        res.status(200).json({ newToken });
    } catch (error) {
        console.error("Error al renovar el token:", error);
        res.status(401).json({ message: "Token inválido o caducado." });
    }
};


module.exports = {
    getUsers,
    getUserByOAuthId,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    validateToken,
    renewToken
};