const Joi = require('joi');
// it demands for schema like -----
// {
// title:
// description:
// image:
// price:
// location:
// country:
// }
const schema = Joi.object({
       title: Joi.string().required(),
   price: Joi.number().required(),
   country: Joi.string().required(),         
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        url:String,
        filename:String

    }),
    reviews:Joi.array().items(Joi.string()),
    owner:Joi.string()
});

// it demands for schema like -----
// {
//     review:{
//         rating:
//         comment:
//     }
// }

const reviewSchema = Joi.object({
   review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
        owner:Joi.string()
    })
});

const userschema=Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required(),
    email:Joi.string().required()
});
module.exports = {
   schema,
   reviewSchema
   ,userschema
};
