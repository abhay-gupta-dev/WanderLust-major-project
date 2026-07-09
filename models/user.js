const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;   // ← .default is correct here

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        url: {
            type: String,
            default: 'https://res.cloudinary.com/demo/image/upload/v1/default-avatar.png'
        },
        filename: {
            type: String,
            default: 'default-avatar'
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);