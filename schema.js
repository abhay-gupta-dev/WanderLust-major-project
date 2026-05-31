const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required().messages({
      "string.empty": "Title is required"
    }),

    description: Joi.string().trim().required().messages({
      "string.empty": "Description is required"
    }),

    image: Joi.string().uri().allow('', null).messages({
      "string.uri": "Image must be a valid URL"
    }),

    price: Joi.number().min(0).required().messages({
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative"
    }),

    location: Joi.string().trim().required().messages({
      "string.empty": "Location is required"
    }),

    country: Joi.string().trim().required().messages({
      "string.empty": "Country is required"
    }),
    category: Joi.string().valid(         // ← add this block
      "trending",
      "rooms",
      "iconic cities",
      "mountains",
      "castles",
      "amazing pools",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
      "historic"
    ).required().messages({
      "any.only": "Please select a valid category",
      "any.required": "Category is required"
    })

  }).required()
});


 module.exports.reviewSchema = Joi.object({
  review: Joi.object({

    rating: Joi.number().min(1).max(5).required().messages({
      "number.min": "Rating must be at least 1",
      "number.max": "Rating cannot exceed 5"
    }),

    comment: Joi.string().trim().required().messages({
      "string.empty": "Comment cannot be empty"
    })

  }).required()
});