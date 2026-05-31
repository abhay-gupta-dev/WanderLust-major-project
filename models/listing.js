const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const review=require('./review');

const listingSchema=new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    image:{
        
         
        url: String,
        filename: String
    },
     price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type:String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
   geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],   // ✅ no hardcoded default anymore
        }
    },
    category: {
    type: String,
    enum: ["trending", "rooms", "iconic cities", "mountains", "castles", 
           "amazing pools", "camping", "farms", "arctic", "domes", "boats", "historic"],
    default: "trending"
}
    
});


listingSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;
