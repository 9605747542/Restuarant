const express=require('express');
// const fileUpload = require('express-fileupload');
const app=express();
const path=require('path');
const nocache=require('nocache');
const UserRoute=require('./routes/UserRoute');
const AdminRoute=require('./routes/AdminRoute');
const bodyParser=require('body-parser');
const session=require('express-session')
const crypto=require('crypto');
const MongoDB=require('./models/database')
const Swal = require('sweetalert2');
const upload=require('./multer'); 

// app.use(upload);
// console.log(typeof upload);






//to set port dynamically from environment file
require("dotenv").config();

app.use(nocache());


// app.use(fileUpload());
app.use(express.static(path.join(__dirname,'public')));




// Set 'views' directory for any views being rendered
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine','ejs');




// Generate a random, secure session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

//session declaring
app.use(session({
    secret:sessionSecret,
    resave:true,
    saveUninitialised:true,

}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(UserRoute);
app.use(AdminRoute);
MongoDB();



const port=process.env.PORT||3005;
app.listen(port,()=>{
    console.log("Port Connected SuccessFully!!");
})