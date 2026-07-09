const User = require('../models/user.js');
const { sendEmail } = require("../utils/sendEmail");

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup', { title: 'Wanderlust Sign Up' });
}

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #fe424d; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Wanderlust!</h1>
            </div>
            <div style="padding: 32px 24px; background-color: #ffffff;">
                <h2 style="font-size: 20px; margin-top: 0;">Hi ${registeredUser.username},</h2>
                <p style="font-size: 15px; line-height: 1.6;">
                    We're thrilled to have you join Wanderlust — your new home for discovering
                    unique stays around the world. Whether you're dreaming of a mountain cabin,
                    a beachfront villa, or a cozy city apartment, your next adventure starts here.
                </p>
                <p style="font-size: 15px; line-height: 1.6;">
                    Here's what you can do now that you're part of the Wanderlust community:
                </p>
                <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
                    <li>Browse thousands of handpicked stays across the globe</li>
                    <li>Save your favorite listings to plan future trips</li>
                    <li>Book securely and manage your trips from your profile</li>
                    <li>Leave reviews to help fellow travelers</li>
                </ul>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="http://localhost:8080/listings"
                       style="background-color: #fe424d; color: #ffffff; text-decoration: none;
                              padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: bold;
                              display: inline-block;">
                        Start Exploring
                    </a>
                </div>
                <p style="font-size: 14px; color: #777; line-height: 1.6;">
                    If you have any questions or need help getting started, our support team is always here for you.
                </p>
            </div>
            <div style="background-color: #f7f7f7; padding: 16px 24px; text-align: center;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                    You're receiving this email because you created an account on Wanderlust.
                </p>
            </div>
        </div>
        `;

        sendEmail(
            registeredUser.email,
            "Welcome to Wanderlust — Let's Get You Exploring!",
            welcomeHtml
        ).catch(err => console.error('Welcome email failed:', err));

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login', { title: 'Wanderlust Login' });
}

module.exports.login = async (req, res) => {
    const welcomeBackHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #fe424d; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome Back!</h1>
        </div>
        <div style="padding: 32px 24px; background-color: #ffffff;">
            <h2 style="font-size: 20px; margin-top: 0;">Hi ${req.user.username},</h2>
            <p style="font-size: 15px; line-height: 1.6;">
                Great to see you again on Wanderlust! Your account was just accessed —
                if this was you, no action is needed and you're all set to keep exploring.
            </p>
            <p style="font-size: 15px; line-height: 1.6;">
                Pick up right where you left off: check your saved listings, review your
                upcoming bookings, or discover new places you haven't explored yet.
            </p>
            <div style="text-align: center; margin: 32px 0;">
                <a href="http://localhost:8080/listings"
                   style="background-color: #fe424d; color: #ffffff; text-decoration: none;
                          padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: bold;
                          display: inline-block;">
                    Continue Exploring
                </a>
            </div>
            <p style="font-size: 14px; color: #777; line-height: 1.6;">
                If this login wasn't you, please secure your account immediately by
                changing your password.
            </p>
        </div>
        <div style="background-color: #f7f7f7; padding: 16px 24px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">
                You're receiving this email because you logged in to Wanderlust.
            </p>
        </div>
    </div>
    `;

    sendEmail(
        req.user.email,
        "Welcome Back to Wanderlust!",
        welcomeBackHtml
    ).catch(err => console.error('Welcome-back email failed:', err));

    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect(req.session.redirectUrl || '/listings');
    });
};

module.exports.uploadProfilePhoto = async (req, res) => {
    if (!req.file) {
        req.flash('error', 'Please select an image to upload.');
        return res.redirect('/profile');
    }

    const user = await User.findById(req.user._id);
    user.profileImage = {
        url: req.file.path,
        filename: req.file.filename
    };
    await user.save();

    req.flash('success', 'Profile photo updated!');
    res.redirect('/profile');
};