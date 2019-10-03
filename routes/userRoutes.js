const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');



const router = express.Router();




//just one endpoint in the route, not traditional api since we can only poost on that
router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);

router.patch('/resetpassword/:token', authController.resetPassword);

//will do an auth check before accessing the paths below(easy way to protect all routes without adding t oeach call )
router.use(authController.protect);

router
.patch('/updatemypassword', 
authController.updatePassword);

router
.get('/me', 
userController.getMe,
userController.getUser);

router
.patch('/updateme',
userController.updateMe);

router
.delete('/deleteme',  
userController.deleteMe)

//another middleware to protect all routes
router.use(authController.restrictTo('admin'));

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