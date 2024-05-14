const express=require('express');
const bodyParser=require('body-parser');
const app=express();
//const morgan=require('morgan');
const userRoutes=require('./routes/routes');
const adminRoutes=require('./routes/adminroutes');
const database=require('./model/db');
const multer  = require('multer');
const passport=require('passport');
const passportStrategy=require('./passport');
const Session=require("express-session");
const GoogleStrategy=require("passport-google-oauth20").Strategy;
//const passport=require('passport');
const config=require('./config/config')


//for google sign in and register


app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({extended: false}));

app.use(
	Session({
		secret:"somesessionkey",
	
        resave: false,
        saveUninitialized: false
	})
);


//for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      return cb(null,uniqueSuffix + '-'+ file.originalname )
    }
  })

const upload=multer({storage})



//app.use('/testing',Routes);
app.use(passport.initialize());
app.use(passport.session());
app.post('/upload',upload.single("image"),(req,res)=>{
    console.log("in upload");
    console.log(req.file);
    return res.send("image uploaded succesfully");
})
app.use('/',userRoutes);
app.use('/',adminRoutes);





const startServer=()=>{
    console.log("Server starting");
    app.listen(6001);
}

const startInstance=async()=>{
    try{
        console.log("pool to be intialized");
        await database.init();
        startServer();
        
    }
    catch(err){
        console.log(err);
    }
}
startInstance();



















