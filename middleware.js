const Listing=require('./models/listing.js');
const Review=require('./models/review.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError.js');

const isLoggedIn = (req, res, next) => {
if (!req.isAuthenticated()) {

        req.session.redirectUrl = req.originalUrl;

        req.flash('error', 'You must be logged in to create listing!');

        return res.redirect('/login');
    }

    next();
};


const saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {

        res.locals.redirectUrl = req.session.redirectUrl;

        delete req.session.redirectUrl;

    }

    next();
};
const isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash('error','You are not the owner of this listing!');
        return res.redirect(`/listings/${id}`);
    }
     next(); 

}
const isauthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error','You are not the author of this review!');
        return res.redirect(`/listings/${id}`);
    }
     next(); 

}
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errMsg = error.details
            .map(el => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errMsg = error.details
            .map(el => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



module.exports = { isLoggedIn, saveRedirectUrl,isOwner,isauthor,validateListing,validateReview };



