let obj=require("../models/listing");


function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){//-----------------isaythenticated internally checks if there is a user object in session or not
    //  and return true or false accordingly----------------------
    req.session.originalUrl=req.originalUrl;//------------------to store the url which user is trying to access in session before redirecting to login page----------------------
        req.flash("error","you must be logged in to do that");
        return res.redirect("/login");
    }
    next();
};

function saveredirecturl(req,res,next){
    if(req.session.originalUrl){
        console.log("original url is",req.session.originalUrl);
        res.locals.redirecturl=req.session.originalUrl;//------------------to make the url which user
        //  is trying to access available in res.locals so that we can use it in login route----------------------
}
next();
}
  async function isowner(req,res,next){
    let { id } = req.params;
    let listing = await obj.findById(id).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    if(!res.locals.curruser || !listing.owner || !listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error", "you are not authorized to edit this listing");
        return res.redirect("/listings");
    }
    next();
}
module.exports = {
    isLoggedIn,
    saveredirecturl,
    isowner
};