if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
    //dotenv helps in accessing private informtion stored in .env file in backend files.
console.log(process.env)}


const express = require("express");
let router=express.Router();
let wrapAsync=require("../../utils/wrapasync.js");
let obj = require("../../models/listing.js");
let  ExpressError=require("../../utils/Expresserror.js");
let reviewobj=require("../../models/review.js");
let {schema,reviewSchema}=require("../../joi.js");
let {isLoggedIn}=require("../../middleware/middleware.js");
let listingformcontroller=require("../../controllers/listingcontroller.js");
let {isowner}=require("../../middleware/middleware.js");
const multer=require("multer");
const{storage}=require("../../cloudconfig.js")
const upload=multer({storage});//folder where our files are actually going to be saved in cloudstorage by multer


// obj.post("findOneAndDelete",async function(doc,next){

//     if(doc){
//         await obj.deleteMany({_id:{$in:doc.reviews}});      // -----------------here how it works-----------------
//     }                                                                         // await Review.deleteMany({
//     _id: { $in: listing.reviews }});
                                                                                 // listing.reviews = [
                                                                                 //     ObjectId("r1"),
                                                                                 //     ObjectId("r2"),
                                                                                 //     ObjectId("r3")
                                                                                 // ];
                                                                                 // await Review.deleteMany({
                                                                                 //     _id: {
                                                                                 //         $in: [
                                                                                 //             ObjectId("r1"),
                                                                                 //             ObjectId("r2"),
                                                                                 //             ObjectId("r3")
                                                                                 //         ]
                                                                                 //     }
                                                                                 // });   
                                                                                 // })


let needvalidation=async (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
if(result.error){
    throw new ExpressError(result.error,400);}

else{
    next();
}}

let validate=(req,res,next)=>{
    //acting as a middleware for validating the data coming from form to backend 
    // using joi validation and if there is any error it will throw an error with status code 400 and message of error 
    // which will be cught in error handling middlewares.

    //since it is synchronouss function. error returned by them will be cught in error handling middlewares.
    let result = schema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    else{
        next();
    }
}

//wrapAsync is a function which detects errors like errors created by async functions and pass them 
// to error handling middlewares by using next function. it is a higher order function which takes a function as an 
// argument and returns a function which is used as a middleware in our routes.
router.get("", wrapAsync(listingformcontroller.listinghomecontroller));

router.get("/new", isLoggedIn, wrapAsync(listingformcontroller.listingnewcontroller));

router.post("/form", isLoggedIn, validate, upload.single("image"), wrapAsync(listingformcontroller.listformcontroller));
// upload.single("image"). is used ti check whether there is a parameter of image which contains file. 
//if there is . then it tells to multer to process it by using storage.
router.get("/form", isLoggedIn, wrapAsync(listingformcontroller.listingnewcontroller));

router.post("/:id/review", isLoggedIn, needvalidation, wrapAsync(listingformcontroller.specificidreviewcontroller));

// router.get("/specific/:id/edit", isLoggedIn, isowner, wrapAsync(listingformcontroller.specificideditcontroller));

router.get("/:id", isLoggedIn, wrapAsync(listingformcontroller.listingspecificcontroller));


// obj.post("findOneAndDelete",async function(doc,next){
//     if(doc){                        ------------------mongoose middleware for deleting reviews of listing when listing is deleted----------------
//         await obj.deleteMany({_id:{$in:doc.reviews}});
//     }
// })

router.delete("/delete/:id",isLoggedIn,isowner,wrapAsync(listingformcontroller.listingdelete));
module.exports=router;