const User = require('../models/user')
const crypto = require('crypto');
const async = require('async');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');

module.exports.registerForm = (req,res)=>{
    res.render('users/register')
};

module.exports.Register = async(req ,res,next) => {
    try {
        const { email,admin,username,password ,confirm} = req.body;
        const user = new User({email,admin, username});
        if (confirm === password){
            const registeredUser = await User.register(user , password)
            req.login(registeredUser , err => {
                if (err) return next(err);
                req.flash('success','successfully registered and signed in');
                res.redirect('/home');
            })
        } else {
            req.flash('error' , "password isn't match");
            res.redirect('/register')
        }
    } catch (e) {
        req.flash('error' , e.message);
        res.redirect('/register')
    }
};

module.exports.loginForm = (req,res)=>{
    res.render('users/login')
};

module.exports.Login = async(req,res)=> {
    req.flash('success', 'Welcome back!');
    res.redirect("/home");    
}; 

module.exports.resetForm = (req,res) => {
    res.render('users/forgot')
};

module.exports.resetMail = (req,res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
            if (!user) {
                req.flash('error', 'No account with that email address exists.');
                return res.redirect('/resetpassword');
            }
    
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
            user.save(function(err) {
                done(err, token, user);
            });
            });
        },
        function(token, user, done) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
            to: user.email,  // Change to  recipient
            from: 'info@enerfacprojects.com', // Change to your verified sender
            subject: 'Enerfacprojects account Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        sgMail.send(msg,function(err) {
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
        })
    }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/resetpassword');
    });
};

module.exports.resetToken = (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/resetpassword');
        }
        res.render('users/reset', {token: req.params.token});
    });
}; 

module.exports.Reset = (req,res, next) => {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if(req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, function(err) {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        function(user, done) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: user.email,  // Change to  recipient
                from: 'info@enerfacprojects.com', // Change to your verified sender
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n' +
                'make sure to be aware of all the actions that happens to your account!'
            }
            sgMail.send(msg,function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/home');
    });
}; 

module.exports.Logout = (req,res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success','logged out !')
        res.redirect('/home')
    });
}; 


