
let wrapAsync=require("../utils/wrapasync.js");
let obj = require("../models/listing.js");
let  ExpressError=require("../utils/Expresserror.js");
let reviewobj=require("../models/review.js");
let {schema,reviewSchema}=require("../joi.js");
let {isLoggedIn}=require("../middleware/middleware.js");





module.exports.listformcontroller=async (req, res,next) => {
    
let filename=req.file.filename;
let url=req.file.path;
        let { title, price, description, country, location, image } = req.body;
        const location1 =location;

// it  has been used for saving logitude and latitude of (location parameter) in schema to show correct location in map.
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location1)}&format=json&limit=1`,
  {
    headers: {
      "User-Agent": "MyNodeApp/1.0"
    }
  }
);

const data = await response.json();
console.log(data)
const lat = Number(data[0].lat);
const lng = Number(data[0].lon);

console.log("longitude is:",lat, lng);
// const lat = data[0].lat;
// const lng = data[0].lon;

        await obj.create({
            title: title,
            price: price,
            description: description,
            country: country,
            location: location,
            image: {url:url,filename:filename},
            owner:req.user._id,
            geometry: {
             coordinates: [lng, lat]
    }
        });




         req.flash("success","listing added");// value will go in successs array.
        //  console.log("kakakakakak",req.session.success)//global object 
        res.redirect("/listings");   
};




module.exports.listingnewcontroller=async (req, res) => {// to check at every call is user loggedin or not.
     let alllistings = await obj.find();
    res.render("new.ejs",{listings:alllistings});
};




module.exports.listingspecificcontroller=async (req, res) => {
    let { id } = req.params;
    console.log("hahah",res.locals.curruser)
    let obj1 = await obj.findById(id).populate({"path":"reviews",
        populate:{
            path:"owner"
        }
    }).populate("owner");
    console.log("obj1 is",obj1);
    if(!obj1){
        req.flash("error","error occured in finding list");
        return res.redirect("/listings");
    } 
    res.render("specific.ejs", { specific:obj1 });
};




module.exports.listinghomecontroller=async (req, res) => {
//     let filename=req.file.filename;
// let url=req.file.path;
    let alllistings = await obj.find();// gives back whole data of collections in array form.
    res.render("index.ejs", { listings: alllistings });
    // console.log(res.locals.success)
    console.log("sample saved")
};

module.exports.listingdelete=async (req, res) => {//-----------isowner middleware is used to check if the user who is trying to delete the listing is the owner of the listing or not----------------
    let { id } = req.params;

    let vari = await obj.findByIdAndDelete(id);
    if (!vari) {
        req.flash("error", "no listing found here")
        res.redirect("/listings")
    }
    req.flash("success", "deleted succesfully");
    res.redirect("/listings");
}




module.exports.specificidreviewcontroller=async (req, res) => {
    console.log("review is",req.body);
    let { review } = req.body;
    let { comment, rating } = review;
    // let rev=req.user.populate("owner");
    console.log(req.user)
    let revieu = new reviewobj({comment: comment, rating: rating,owner:req.user._id});// creating a review document with the data coming from form and owner is the id of user who is currently logged in and creating the review.
    let { id } = req.params;
    let list = await obj.findById(id);
    if(!list){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    await revieu.save();
    list.reviews.push(revieu._id);
    await list.save();
    res.redirect("/listings/" + id);
};




// module.exports.specificideditcontroller=async (req, res) => {//retrieivng id

//     let { id } = req.params;
//     console.log(id)
//     let obj1 = await obj.findById(id).populate("owner");
//     console.log("object is",obj1)
//     let updatedurl=obj1.image.url;
//     console.log(updatedurl)
//     updatedurl=updatedurl.replace("/upload","/upload/h_300/w_250");
//     if (!obj1) {
//         throw new ExpressError("No listing found with this id", 404);
//     }
//     res.render("edit.ejs", { id: id, obj1: obj1 ,updatedurl:updatedurl})
// }