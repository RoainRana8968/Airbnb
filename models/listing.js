const mongoose = require("mongoose");


  const Review=require("./review.js");
    
let ListSchema = new mongoose.Schema({// declaring schema for our collection
    title: String,
    description: String,
    image: {
      url:String,
      filename:String,
        // type: String,
        // default: "https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/2/f/3/2f3c2b936a_50185294_ocean-plus-chaud.jpg",
        // set: (v) => v === "" ? "https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/2/f/3/2f3c2b936a_50185294_ocean-plus-chaud.jpg" : v,
    },
    price: {type: Number, min: 0},
    location: {type: String},
    country: {
  type: String},
  reviews: [
    // /one to many relationship between listing and review, we are storing the id of review document in listing document and then using populate method to get the review document from database when we need it. this is called referencing.,
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  geometry:{
    coordinates:{
      type:[Number],
    }
  }
});


  ListSchema.post("findOneAndDelete", async function(review){

   if(review){
      await Review.deleteMany({
         _id: {$in: review.reviews}   //$pull cannot be used here because we donot have an access of all reviews id that are deleted by findbyidanddelete()
        //  to delete those reviews from review ocollection whose id was in reviews array of listing document which has been deleted by findbyidanddelete method.
      });
   }

});

    

let Listing = mongoose.model("Listing", ListSchema);// creating a model for connecting schema with collection
//  and also gives us methods to perform operations on database.
module.exports = Listing;
