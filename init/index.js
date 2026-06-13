const mongoose=require("mongoose");
const initdata=require("./data.js");//retrieving data . it returns array of objects which we will insert in our database.
const dbobj=require("../models/listing.js");//estabilishing set up;

const initdb=async ()=>{
    await dbobj.deleteMany({});//deleting all the data in our database before inserting new data. so that we can avoid duplicate data in our database.
   initdata.data = initdata.data.map((obj)=>({...obj,owner:"6a23de841f9308ed2c71a4f2"}));// adding owner feild in each object of data which is the id of user who is the owner of all the listings in our data.
    await dbobj.insertMany(initdata.data).then((res)=>{
    });
    console.log("data inited")
}

initdb();



