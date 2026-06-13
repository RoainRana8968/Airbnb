const express = require("express");
let cookieParser = require("cookie-parser");
let app=express();
let path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
let expresssession=require("express-session");
let flash=require("connect-flash");
app.use(flash());
app.use(expresssession({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true
}));    
// secretcode gives a session id to each user and stores it in a cookie and also stores the session data in the server memory/session store.
// resave: false means that the session will not be saved back to the session store if it was not modified during the request.

// saveUninitialized: true  forces a session that is "uninitialized" to be saved to the store. A session is 
// uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, 
// reducing server storage usage, or complying with laws that require permission before setting a cookie. 
// Choosing true will save a session that is new but not modified, which can be useful for implementing 
// "remember me" functionality, reducing server storage usage, or complying with laws that require permission before setting a cookie.
app.get("/",(req,res)=>{
    res.send("expresssession abled");
});
app.get("/setcook",(req,res)=>{
    console.log(req.cookies);
})
// let userroute=require("./routes/user.js");
// let postroute=require("./posts/post.js");
// app.use("/users",userroute);
// app.use("/posts",postroute);

// app.use(cookieParser("secretcode"));

let port=9090;
app.listen(port,()=>{
    console.log("port running");
});
app.get("/recount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count=1;}
    res.send("count is "+req.session.count);}
    )
// using connect-flash for flashing messages to the user. It uses the session to store the messages, 
// so it requires express-session to be set up.
    app.get("/check",(req,res)=>{
        let {name="anonympous"}=req.query;
        req.session.name=name;
        if(name==="anonympous"){
            //will be stored in req.session object
            req.flash("error","error occured");}
        else{
            req.flash("success","name is set successfully");
        }
       res.redirect("/flash");
    });
    app.get("/flash",(req,res)=>{
        // ..req.flash values will be stored in res.locals object and 
        // will be available in all routes and views.
        res.locals.message=req.flash("success");
        res.locals.error=req.flash("error");
        res.render("flash.ejs",{name:req.session.name});
    })