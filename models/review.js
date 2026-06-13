const mongoose = require("mongoose");
// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');// connecting mongoose to database
// }
// main().then(() => {
//     console.log("database connected");
// })
//     .catch((err) => {
//         console.log(err);
//     });

  let reviewschema = new mongoose.Schema({
    rating:{type: Number, min: 1, max: 5},
    comment: {type: String, trim: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    });  
    let revobj=mongoose.model("Review",reviewschema);
    module.exports=revobj;