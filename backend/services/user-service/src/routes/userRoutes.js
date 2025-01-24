const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);       // Get all users
router.get('/:email', userController.getUserByEmail);  // Get user by email
router.get('/:_id', userController.getUserById);  // Get user by id
router.post('/', userController.createUser);    // Create a new user

router.put('/:email', userController.updateUser);   // Update a user
router.delete('/:email', userController.deleteUser); // Delete a user

router.post('/login', userController.login); // Login a user
router.post('/validate-token', userController.validateToken); // Validate token
router.post('/renew-token', userController.renewToken); // Renew token

module.exports = router;