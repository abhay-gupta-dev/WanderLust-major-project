const express = require('express');
const router = express.Router();
const User=require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport=require('passport');
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js');
const userController=require('../controllers/user.js');
const Booking = require('../models/booking.js');
const { validateUser } = require('../middleware.js');
const multer = require('multer');
const { profileStorage } = require('../cloudConfig.js');
const upload = multer({ storage: profileStorage });


router.route('/signup')
.get(userController.renderSignupForm)
.post(validateUser, wrapAsync(userController.signup));   // ← added validateUser

router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),userController.login);
 
router.get('/about', (req, res) => {
    res.render('listings/about', { title: 'About Wanderlust' });
});
 router.get('/logout',userController.logout);
router.get('/profile', async (req, res) => {
   
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please login first!');
        return res.redirect('/login');
    }

    const bookings = await Booking.find({ user: req.user._id })
        .populate('listing')
        .sort({ createdAt: -1 });

    res.render('users/profile', { user: req.user, bookings });
});
router.post('/profile/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const { username } = req.body;
    const existing = await User.findOne({ username });
    if (existing && !existing._id.equals(req.user._id)) {
        req.flash('error', 'Username already taken!');
        return res.redirect('/profile');
    }
    await User.findByIdAndUpdate(req.user._id, { username });
    req.flash('success', 'Username updated!');
    res.redirect('/profile');
}));
router.post('/profile/photo', isLoggedIn, upload.single('profileImage'), wrapAsync(userController.uploadProfilePhoto));
router.get('/bookings', isLoggedIn, async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    })
    .populate('listing')
    .sort({ createdAt: -1 });

    res.render('users/mybooking', { bookings });
});
router.post(
    "/listings/:id/bookings/:bookingId/cancel",
    isLoggedIn,
    async (req, res) => {

        const { bookingId } = req.params;

        await Booking.findByIdAndUpdate(
            bookingId,
            { status: "cancelled" }
        );

        req.flash(
            "success",
            "Booking cancelled successfully!"
        );

        res.redirect("/bookings");
    }
);
module.exports = router;