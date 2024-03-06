const mongoose=require('mongoose');
const mongodb=async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/Restuarant")

        console.log("MongoDB Connected");
    }

catch(err){
    console.log("Failed to Connected due to",err.message);
}
}
module.exports=mongodb;
