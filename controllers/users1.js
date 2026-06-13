const userobj = require("../models/user.js");

module.exports.signupregistered=async (req, res, next) => {
    let { username, password, email } = req.body;
    try {                                                         //----------------------flow of signup page----------------------------
        let obj = new userobj({
            username: username,
            email: email
        });
        let reguser= await userobj.register(obj, password);
        req.login(reguser,(err)=>{                               //-----------for automatically login after signup----------------------
            if(err){
                return next(err);                            
            }
            req.flash("success", "welcome to yelp camp");
            res.redirect("/listings");
        })
    }
    catch (err) {
        console.error("Signup error:", err);
        if (err.name === "UserExistsError") {
            req.flash("error", "Username already registered");
        } else {
            req.flash("error", err.message || "Signup failed. Please try again.");
        }
        return res.redirect("/signup");// only one response can be sent to client at one time of request.
    }
    // req.flash("success", "registered succesfully");
    // res.redirect("/listings");
}
module.exports.logout=(req, res) => {
    // After login, serializeUser() stores the user id in the session.On later requests, passport.session() reads that id and calls
    //  deserializeUser() to populate req.user.Then req.isAuthenticated() checks whether req.user exists.
        req.logout(function (err) {
            if (err) { return next(err); }
            else {
                req.flash("success", "logged out succesfully");
                res.redirect("/listings");
            }
        })
}

module.exports.signup=(req, res) => {
    // isauthenticate is a middleware provided by passport which is used for authenticating the
    //  user by using the strategy defined in passport.use() and if authentication is successful 
    // then it will call the callback function and if authentication fails then 
    // it will redirect to the url defined in failureRedirect.
    // it internally calls findOne() method with username as a paramter  and then it will hash password 
    // stord in database. ---------very very important-----. (((before login person needs to signup)))
    req.flash("success", "welcome back");
    let redirecturl=res.locals.redirecturl||"/listings";// res.locals.redirecturl is set in saveredirecturl middleware which is used to save the url which user is trying to access before login and after login user will be redirected to that url.
    res.redirect(redirecturl);//------------------to redirect user to the url which user is trying to access before login or if there is no url stored in session then redirect to listings page----------------------
}