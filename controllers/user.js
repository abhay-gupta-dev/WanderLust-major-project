const User=require('../models/user.js');
const sendEmail = require("../utils/sendEmail");


module.exports.renderSignupForm=(req, res) => {
    res.render('users/signup', {title: 'Wanderlust Sign Up'});
}
module.exports.signup = async (req,res,next)=>{
    try{

        let {username,email,password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            req.flash("error","Please enter a valid email");
            return res.redirect("/signup");
        }

        if(password.length < 8){
            req.flash("error","Password must be at least 8 characters");
            return res.redirect("/signup");
        }

        const newUser = new User({username,email});

        const registeredUser =
            await User.register(newUser,password);

        // SEND EMAIL ONCE AFTER SIGNUP
        await sendEmail(
            registeredUser.email,
            "Welcome to Wanderlust",
            `Hi ${registeredUser.username},

Welcome to Wanderlust!

Your account has been created successfully.`
        );

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }

            req.flash('success','Welcome to Wanderlust!');
            res.redirect('/listings');
        });

    } catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login',{title:'Wanderlust Login'});
}
module.exports.login = async (req, res) => {
    req.flash('success','Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Logged out successfully!');
        res.redirect(req.session.redirectUrl || '/listings');
    });

  };
