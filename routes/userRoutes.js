const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');



const router = express.Router();


//just one endpoint in the route, not traditional api since we can only poost on that
router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);

router.patch('/resetpassword/:token', authController.resetPassword);

router
.patch('/updatemypassword', 
authController.protect, 
authController.updatePassword);

router
.get('/me', 
authController.protect, 
userController.getMe,
userController.getUser);

router
.patch('/updateme',
authController.protect,
userController.updateMe);

router
.delete('/deleteme', 
authController.protect, 
userController.deleteMe)


router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);


module.exports = router;