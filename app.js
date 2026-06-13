const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require('dotenv').config();
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);// connecting mongoose to database
    //once w change the url by using mongoose atlas.backend no longer uses local database
}
main().then(() => {
    console.log("database connected");
})
    .catch((err) => {
        console.log(err);
    });
let obj = require("./models/listing.js");
let path = require("path");
let wrapAsync = require("./utils/wrapasync.js");
let app = express();
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));//app.use(express.static("C:\\Users\\Rohit\\MAJORPROJECT\\public"));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({
    extended: true
}));
let ExpressError = require("./utils/Expresserror.js");
let reviewobj = require("./models/review.js");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const multer = require("multer");
const { storage } = require("./cloudconfig.js")
const upload = multer({ storage });

let { schema, reviewSchema, userschema } = require("./joi.js");
let { isLoggedIn } = require("./middleware/middleware.js");
let { saveredirecturl } = require("./middleware/middleware.js");
let { isowner } = require("./middleware/middleware.js");
let signup = require("./controllers/users1.js")
// joi is just used for validating the data coming from frontend too backend whchi checks. are all the required feilds present or not
// and also checks the type of data coming from frontend to backend and if there is any error it will throw rror
let flash = require("connect-flash");

let expressession = require("express-session");
const MongoStore = require('connect-mongo').default;
// MongoStore.create() is used to create a MongoDB-backed session store that express-session can use.
// this function is usd only for creating permnent session in database 
// to store session data
let store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("error")
})
// when we use express session. our session data is stored in session but as we 
// restart server.all session data is lost.so to protect it.we implement a parameter of connect - mongo 
//  which is (store) inside app.use.
app.use(expressession({// will create session Id which weill be sent back to browser
    store: store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));
//used for avoiding relogin anfgain anfd again

app.use(flash());

let passport = require("passport");
const LocalStrategy = require("passport-local");// used for authenticating username and passwords
let userobj = require("./models/user.js");
app.use(passport.initialize());// to initlaise passport related functions.
app.use(passport.session());//On later requests, passport.session() reads the user ID from the session and calls deserializeUser().
passport.use(new LocalStrategy(userobj.authenticate()));//used for checking credentials 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(userobj.serializeUser());// storing user-id in to req.session.passport so that conditon 
// of re-login again and again can be avoided
passport.deserializeUser(userobj.deserializeUser());// for attaching object of user which 
// is logged in to req.user so that we can access it in our routes and views.


//when login will happen then passport will call serializeUser function and it will store the user id in session
//  and when we will make any request after login then passport will call deserializeUser function and it will 
// attach the user object to req.user by using the id stored in session. so we can access the user object in our
//  routes and views by using req.user and as use id gets stored in session . it will automatically create an 
// userobj .

let listingsroute = require("./classroom/listings/listings.js");

//middleware for flashing messages to the user. It uses the session to store the messages, 
// so it requires express-session to be set up.
//  It will make the messages available in res.locals for all routes and views.

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;// to make user object available in all routes and views by using res.locals even in ejs files
    next();
})
app.use("/listings", listingsroute);





let port = 8080;
app.listen(port, () => {
    console.log("port running");
});

app.get("/", (req, res) => {
    res.send("port abled");
});



// it might be also poissible that user can send data by using api like postman/hoppscotch where it can send empty data in any feild directly 
// to backend which can give error of validation error
// let validate = (req, res, next) => {
//     //acting as a middleware for validating the data coming from form to backend 
//     // using joi validation and if there is any error it will throw an error with status code 400 and message of error 
//     // which will be cught in error handling middlewares.

//     //since it is synchronouss function. error returned by them will be cught in error handling middlewares.
//     let result = schema.validate(req.body);
//     if (result.error) {
//         throw new ExpressError(result.error, 400);
//     }
//     else {
//         next();
//     }
// }
app.get("/specific/:id/edit", isLoggedIn, isowner, wrapAsync(async (req, res) => {//retrieivng id

    let { id } = req.params;

    let obj1 = await obj.findById(id).populate("owner");
    if (!obj1) {
        throw new ExpressError("No listing found with this id", 404);
    }
    let updatedurl = obj1.image.url;
    updatedurl = updatedurl.replace("/upload", "/upload/h_100/w_250");
    if (!obj1) {
        throw new ExpressError("No listing found with this id", 404);
    }
    console.log(obj1)
    res.render("edit.ejs", { id: id, obj1: obj1, updatedurl })
}));



app.patch("/edit/:id/form", isLoggedIn, isowner, upload.single("image"), wrapAsync(async (req, res) => {
    let { title, price, description, country, location, image } = req.body;
    let { id } = req.params;
    if (id === undefined) {
        throw new ExpressError("No listing found with this id", 404);
    }
    let listing = await obj.findByIdAndUpdate(id, { title, price, description, country, location, image }, { runValidators: true });
    console.log(listing)
    if (req.file) {
        let filename = req.file.filename;
        let url = req.file.path;
        listing.image.url = url;
        listing.image.filename = filename;
        await listing.save();
    }

    res.redirect("/listings");
}));









// app.use("/", (req, res, next) => {
//     console.log("Root middleware");
//     next();
// });

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {              // ----------------------flow of login page----------------------------
//         return next();
//     }
//     res.redirect("/login");
// }

// app.get("/check", isLoggedIn, (req, res) => {
//     res.send("Protected page");
// });


let uservalidate = async (req, res, next) => {
    let result = userschema.validate(req.body);
    if (result.error) {
        throw new ExpressError(result.error, 400);
    }
    else {
        next();// after calling next. it wil call callback function defined in route handler.
    }
};

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
app.post("/signup", uservalidate, wrapAsync(signup.signupregistered));

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/login", saveredirecturl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), signup.signup);

// User submits username/password
//             ↓
// passport.authenticate("local")
//             ↓
// Username found?
//             ↓
// Password correct?
//             ↓
// req.login(user)  ← Passport does this internally
//             ↓
// serializeUser(user)
//             ↓
// Store user id in session
//             ↓
// Your callback runs
//             ↓
// res.redirect("/listings")





app.get("/logout", signup.logout);



// it will catch all errors thrwon by routes and send it to client with status code and message.
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    console.log("error is", err);
    res.render("error.ejs", { message });

    console.error(err);

})


