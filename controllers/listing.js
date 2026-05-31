const Listing = require('../models/listing.js');
const geocoder = require('../utils/geocoder');


module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
        filter.category = { $in: [category] };
    }

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const allListings = await Listing.find(filter);
    res.render('listings/index.ejs', { 
        listings: allListings,
        category: category || null,
        search: search || null,
        title: "Wanderlust | All Listings" 
    });
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs', { title: ' Wanderlust create a new listing' });
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    const locationQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
    const result = await geocoder.geocode(locationQuery);

    if (result.length > 0) {
        // ✅ best match by city name
        const bestMatch = result.find(r =>
            r.city && r.city.toLowerCase() === req.body.listing.location.toLowerCase()
        ) || result[0];

        newListing.geometry = {
            type: "Point",
            coordinates: [bestMatch.longitude, bestMatch.latitude]
        };
        console.log("Best match:", bestMatch.formattedAddress);
    } else {
        newListing.geometry = {
            type: "Point",
            coordinates: [78.9629, 20.5937] // fallback to center of India
        };
        req.flash('error', 'Location not found on map, showing approximate location.');
    }

    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect('/listings');
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const showListing = await Listing.findById(id)
        .populate('owner')
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        });

    if (!showListing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }

    res.render('listings/show.ejs', {
        listing: showListing,
        title: 'Wanderlust Show your listing'
    });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;

    let editListing = await Listing.findById(id);

    if (!editListing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }

    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250,h_300');

    res.render('listings/edit.ejs', {
        listing: editListing,
        originalImageUrl,
        title: 'Wanderlust Edit your listing'
    });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        { runValidators: true, new: true }
    );

    const locationQuery = `${req.body.listing.location}, ${req.body.listing.country}`;
    const result = await geocoder.geocode(locationQuery);

    if (result.length > 0) {
        // ✅ best match by city name
        const bestMatch = result.find(r =>
            r.city && r.city.toLowerCase() === req.body.listing.location.toLowerCase()
        ) || result[0];

        listing.geometry = {
            type: "Point",
            coordinates: [bestMatch.longitude, bestMatch.latitude]
        };
        console.log("Best match:", bestMatch.formattedAddress);
        await listing.save();
    }

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    console.log("Deleted item:", deletedItem);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect('/listings');
}