const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose').default;
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');// connecting mongoose to database
// }
// main().then(() => {
//     console.log("database connected");
// })
//     .catch((err) => {
//         console.log(err);
//     });

    let userschema=new mongoose.Schema({
        email:String,
    })

   userschema.plugin(passportLocalMongoose);// will autmoatically add username and password
   // Passport-Local Mongoose will add a username,hash and salt field to store the username,
   //  the hashed password and the salt value.
//    Instance methods--------
    //   setPassword(password, [cb])
    //   changePassword(oldPassword, newPassword, [cb])
    //   authenticate(password, [cb])
    //   resetAttempts([cb])

    let userobj=mongoose.model("User",userschema);
    
    module.exports=userobj;