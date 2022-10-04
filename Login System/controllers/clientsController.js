const pool = require('../SQL_config');
const crypto = require('crypto');
const async = require('async');
const bcrypt = require('bcrypt')
const sgMail = require('@sendgrid/mail');

module.exports.registerForm = (req,res)=>{
    res.render('clients/eRegister')
};

module.exports.confirmEmail = async(req,res,next) => {
    const { email } = req.body;
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
            });
        },
        function(token,done) {
            let userItem = {
                email: email,
                registerToken: token
            };
            pool.query(
                ' INSERT INTO clients set ? ', userItem,
                (err) => {
                    if (err) {
                        req.flash('error' , "a user with this email is already registered");
                        res.redirect('/clients/register')
                    } else {
                        done(err, token);
                    }
                }
            )
        },
        function(token, done) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,  // Change to  recipient
                from: 'info@enerfacprojects.com', // Change to your verified sender
                subject: 'Enerfacprojects account confirm your account',
                text: 'You are receiving this because you (or someone else) have requested the create a user with your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/clients/register/' + token +'\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            }
            sgMail.send(msg,function(err) {
                req.flash('success', 'An e-mail has been sent to ' + email + ' with further instructions to complete your authentication process');
                done(err, 'done');
            })
        }
    ], 
    function(err) {
        if (err) return next(err);
        res.redirect('/clients/register');
    });
}

module.exports.registerCompleteForm = async(req,res,next) => {
    pool.query(
        `SELECT * FROM clients WHERE registerToken = '${req.params.token}'`,
        (err,result) => {
            if (err) {
                req.flash('error', 'email token is invalid.');
                return res.redirect('/clients/resetpassword');
            }
            res.render('clients/register', { email : result[0].email} );
        }
    )
}

module.exports.Register = async(req ,res,next) => {
    const { email,username,password ,confirm} = req.body;
    try {
            if (confirm === password){
                // hashing the password 
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(password , salt);
                // initializing the new user data
                let userItem = {
                    username: username,
                    password: hashedPassword,
                    registerToken:null
                };
                //inserting the new user
                pool.query(
                    `UPDATE clients set ? WHERE email = '${email}'`, userItem,
                    (err) => {
                        if (err) {
                            req.flash('error' , "a user with this email is already registered");
                            res.redirect('/clients/register')
                        } else {
                            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                            const msg = {
                                to: email,  // Change to  recipient
                                from: 'info@enerfacprojects.com', // Change to your verified sender
                                subject: 'Enerfacprojects account confirm your account',
                                text: 'Your email is confirmed successfully , and a user with your account was created.\n\n' +
                                'you can start using our services using the following kink' +
                                'http://' + req.headers.host + '/clients/login/' +'\n' 
                            }
                            sgMail.send(msg,function(err) {
                                if(err){
                                    req.flash('error' , "error sending the email");
                                    redirect("/clients/register")
                                }
                                req.flash('success' , "successfully registered");
                                res.redirect("/clients/login");                            
                            })
                        }
                    }
                )
            }
    } catch (e) {
        req.flash('error' , e.message);
        res.redirect('/register')
    }
};

module.exports.loginForm = (req,res)=>{
    res.render('clients/login')
};

module.exports.Login = async(req,res,next)=> {
    const { email , password } = req.body;
    let client = {email:email}
    pool.query(
        `SELECT * FROM clients WHERE email = '${email}'`,
        async (err ,result) => {
            if(result.length === 0){
                req.flash('error', "email or password isn't correct!");
                res.redirect('/clients/login');            
            }else {
                client.username = result[0].username;
                const logged = await bcrypt.compare(`${password}`, `${result[0].password}`)
                if (logged) {
                    req.session.client = client;
                    req.flash('success', 'Welcome back!');
                    res.redirect("/home");
                } else {
                    req.flash('error', "email or password isn't correct!");
                    res.redirect('/clients/login');
                }; 
            }
        }
    );    
}; 

module.exports.Logout = (req,res) => {
    req.session.client = null;
    req.flash('success','logged out !')
    res.redirect('/home')
}; 

///////////////////////////////////////////

module.exports.resetForm = (req,res) => {
    res.render('clients/forgot')
};

module.exports.resetMail = (req,res, next) => {
    const { email } = req.body;
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
            });
        },
        function(token, done) {
            pool.query(
                `SELECT * FROM clients 
                WHERE email = '${email}'`,
                async (err , result) => {
                    if (result.length === 0) {
                        req.flash('error', 'no account with that email address exists.');
                        return res.redirect('/clients/resetpassword');
                    } else {
                        var today = new Date();
                        var time = (today.getHours()+1)  + ":" + today.getMinutes() + ":" + today.getSeconds();
                        pool.query(
                            `UPDATE clients set 
                                resetPasswordToken ='${token}',
                                resetPasswordExpires = '${time}'
                                WHERE email = '${email}'`,
                            (err ,result) => {
                                done(err, token);
                            }
                        )
                    }
                }
            )
        },
        function(token, done) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
            to: email,  // Change to  recipient
            from: 'info@enerfacprojects.com', // Change to your verified sender
            subject: 'Enerfacprojects account Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/clients/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        sgMail.send(msg,function(err) {
            req.flash('success', 'An e-mail has been sent to ' + email + ' with further instructions.');
            done(err, 'done');
        })
    }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/clients/resetpassword');
    });
};

module.exports.resetToken = (req, res) => {
    var today = new Date();
    var time = today.getHours()  + ":" + today.getMinutes() + ":" + today.getSeconds();
    pool.query(
        `SELECT * FROM clients WHERE resetPasswordToken = '${req.params.token}' AND resetPasswordExpires >= '${time}'`,
        (err,result) => {
            if (err) {
                req.flash('error', 'password reset token is invalid or has expired.');
                return res.redirect('/clients/resetpassword');
            }
            res.render('clients/reset', {token: req.params.token});
        }
    )
}; 

module.exports.Reset = (req,res, next) => {
    const { password ,confirm} = req.body;
    let email;
    async.waterfall([
        function(done) {
            var today = new Date();
            var time = today.getHours()  + ":" + today.getMinutes() + ":" + today.getSeconds();
            pool.query(
                `SELECT * FROM clients WHERE resetPasswordToken = '${req.params.token}' `,
                    async (err,result) => {
                        email = result[0].email;
                        if (err) {
                            req.flash('error', 'password reset token is invalid or has expired.');
                            return res.redirect('back');
                        } else {
                            if(password === confirm) {
                                const salt = await bcrypt.genSalt(12);
                                const hashedPassword = await bcrypt.hash(password , salt);
                                pool.query(
                                    `UPDATE clients set 
                                        resetPasswordToken ='${null}',
                                        resetPasswordExpires = '',
                                        password = '${hashedPassword}'
                                        WHERE resetPasswordToken = '${req.params.token}'`,
                                    (err ,result) => {
                                        if(err){
                                            req.flash("error", err);
                                            return res.redirect('back');
                                        } else {
                                            done(err, email);
                                        }
                                    }
                                )
                            } else {
                                req.flash("error", "passwords do not match.");
                                return res.redirect('back');
                            }
                        }
                    }
            )
        },
        function(email, done) {
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,  // Change to  recipient
                from: 'info@enerfacprojects.com', // Change to your verified sender
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + email + ' has just been changed.\n' +
                'make sure to be aware of all the actions that happens to your account!'
            }
            sgMail.send(msg,function(err) {
                req.flash('success', 'success! your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/clients/login');
    });
}; 