const Booking = require('../models/booking.js');
const Listing = require('../models/listing.js');

module.exports.createBooking = async (req, res) => {
       console.log("=== CREATE BOOKING ROUTE HIT ===");
    console.log("Body:", req.body);
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body.booking;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    // prevent owner from booking their own listing
    if (listing.owner._id.equals(req.user._id)) {
        req.flash('error', 'You cannot book your own listing!');
        return res.redirect(`/listings/${id}`);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        req.flash('error', 'Check-out must be after check-in!');
        return res.redirect(`/listings/${id}`);
    }

    // check for conflicting bookings
    const conflict = await Booking.findOne({
        listing: id,
        status: { $ne: 'cancelled' },
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        ]
    });

    if (conflict) {
        req.flash('error', 'These dates are already booked. Please choose different dates.');
        return res.redirect(`/listings/${id}`);
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const newBooking = new Booking({
    listing:id,
    user:req.user._id,
    checkIn:checkInDate,
    checkOut:checkOutDate,
    guests,
    totalPrice,
    status:"confirmed"
});
console.log("New Booking:");
console.log(newBooking);

try {
    console.log("Before save");

    const savedBooking = await newBooking.save();

    console.log("After save");
    console.log(savedBooking);

} catch(err) {
    console.log("BOOKING SAVE ERROR:");
    console.log(err);
    console.log(err.message);
}
    req.flash('success', `Booking confirmed! Total: ₹${totalPrice.toLocaleString('en-IN')} for ${nights} night(s).`);
    res.redirect(`/listings/${id}`);
};

module.exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        req.flash('error', 'Booking not found!');
        return res.redirect('/profile');
    }

    if (!booking.user.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to cancel this booking!');
        return res.redirect('/profile');
    }

    booking.status = 'cancelled';
    await booking.save();

    req.flash('success', 'Booking cancelled successfully.');
    res.redirect('/profile');
};

module.exports.deleteBooking = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) { req.flash('error', 'Booking not found!'); return res.redirect('/profile'); }
    if (!booking.user.equals(req.user._id)) { req.flash('error', 'Unauthorized!'); return res.redirect('/profile'); }
    if (booking.status !== 'cancelled') { req.flash('error', 'Only cancelled bookings can be deleted!'); return res.redirect('/profile'); }
    await Booking.findByIdAndDelete(bookingId);
    req.flash('success', 'Booking removed from history.');
    res.redirect('/profile');
};