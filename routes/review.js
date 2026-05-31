const express=require('express');
const router=express.Router({mergeParams:true});
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { validateReview,isLoggedIn,isauthor } = require('../middleware.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema } = require('../schema.js');
const Review=require('../models/review');
const reviewController=require('../controllers/review.js');


//reviews post route
router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete route for reviews
router.delete('/:reviewId', isLoggedIn,wrapAsync(reviewController.deleteReview));

module.exports=router;