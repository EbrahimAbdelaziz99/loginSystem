const express = require("express");
const router = express.Router();
const passport = require('passport');

const { isAdmin } = require('../middleware');
const userController = require('../controllers/usersController')

// Error handler 

const catchAsync = require('../utils/catchAsync') 

//////////////////////////////

router.get('/register',isAdmin ,userController.registerForm);

router.post('/register',isAdmin ,catchAsync(userController.Register));

router.get('/login', userController.loginForm);

router.post('/login',passport.authenticate('local' ,{failureFlash:true , failureRedirect: '/login'}), catchAsync((userController.Login)));

router.get('/resetpassword' ,userController.resetForm)

router.post('/resetpassword' ,userController.resetMail);

router.get('/reset/:token', userController.resetToken);

router.post('/reset/:token' ,userController.Reset);

router.get('/logout',userController.Logout);

module.exports = router