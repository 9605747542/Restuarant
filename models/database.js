const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const database=process.env.DATABASE_URL;
console.log(database);
const mongodb=async ()=>{
    try{
        await mongoose.connect(database);
        console.log("MongoDB Connected");
    }

catch(err){
    console.log("Failed to Connected due to",err.message);

}
}
module.exports=mongodb;
