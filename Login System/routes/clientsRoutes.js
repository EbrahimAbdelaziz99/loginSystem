const express = require("express");
const router = express.Router();
const clientsController = require('../controllers/clientsController');

const catchAsync = require('../utils/catchAsync') 

// registeration routes .
// send confirmation email with a token to approve that a user own it 
// register and sign in 

router.get('/register' , clientsController.registerForm);

router.post('/confirm' , clientsController.confirmEmail);

router.get('/register/:token' , clientsController.registerCompleteForm);

router.post('/register'  ,catchAsync(clientsController.Register));

// login routes .

router.get('/login', clientsController.loginForm);

router.post('/login', catchAsync((clientsController.Login)));

// logout routes .

router.get('/logout',clientsController.Logout);

// password reset routes .
// send email to the requisted email with a token to confirm it
// reset the password and sign in 

router.get('/resetpassword' ,clientsController.resetForm);

router.post('/resetpassword' ,clientsController.resetMail);

router.get('/reset/:token', clientsController.resetToken);

router.post('/reset/:token' ,clientsController.Reset);

module.exports = router;