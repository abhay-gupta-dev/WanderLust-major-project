const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn } = require('../middleware.js');
const bookingController = require('../controllers/booking.js');

router.post('/', isLoggedIn, wrapAsync(bookingController.createBooking));
router.post('/:bookingId/cancel', isLoggedIn, wrapAsync(bookingController.cancelBooking));
router.post('/:bookingId/delete', isLoggedIn, wrapAsync(bookingController.deleteBooking)); // 👈 add this

module.exports = router;