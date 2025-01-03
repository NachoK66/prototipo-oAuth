const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/', userController.getUsers);       // Get all users
router.get('/:oauthId', userController.getUserByOAuthId);  // Get user by oAuthId
router.get('/:_id', userController.getUserById);  // Get user by id
router.post('/', userController.createUser);    // Create a new user

router.put('/:oauthId', userController.updateUser);   // Update a user
router.delete('/:oauthId', userController.deleteUser); // Delete a user

router.post('/login', userController.login); // Login a user
router.post('/validate-token', userController.validateToken); // Validate token
router.post('/renew-token', userController.renewToken); // Renew token

module.exports = router;