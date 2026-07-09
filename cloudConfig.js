const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ['png', 'jpg', 'jpeg']
    }
});

// ← new: separate storage for profile photos
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV/profiles',
        allowedFormats: ['png', 'jpg', 'jpeg'],
        transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }] // auto-crop square, centered on face
    }
});

module.exports = { cloudinary, storage, profileStorage };