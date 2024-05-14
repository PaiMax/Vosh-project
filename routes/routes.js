const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const config=require('../config/config')
require('../passport');
const auth=require('../middleware/auth')
//const routes = require('../app/routes/routes');
//const api = require("../lib/api");

// router.get('/testingRoutes',recipeController.getTestingData);
// router.post('/api/searchByName',recipeController.getRecipeByName);
// router.post('/api/login',recipeController.userLogin);
router.post('/user/api/register', async function(req, res){
    try{
        const response=await userController.signUp(req.body);
        res.send(response.message);

    }
    catch(err){
        console.log(err);
        res.send(err);

    }


});
router.post('/user/api/login',async function(req, res){
    try{
        const response=await userController.login(req.body);
        console.log(JSON.stringify(response));
        res.send(response.message);

    }
    catch(err){
        console.log(err);
        res.send(err); }
    })

router.get('/login/success',async (req,res)=>{
        if(req.user){
           const response=await userController.genratetoken(req.user);
           res.send(response);
        }
        else{res.status(200).json({
            error:true,
            message:"not authoirzed",
            user:req.user
        })

        }
    })

router.get('/login/failed',(req,res)=>{
        res.send("Login failed");
    })

router.get('/google',passport.authenticate('google',{scope:['email','profile']}))
router.get('/api/googlecallback',passport.authenticate("google",{
        successRedirect:'http://localhost:6001/login/success',
        failureRedirect:"http://localhost:6001/login/failed",
    }))

router.post('/api/insert',auth.authentication,async function(req, res){
    try{
        const response=await userController.insertDetails(req.body);
        res.send(response.message);

    }
    catch(err){
        console.log(err);
        res.send(err);

    }})


    router.post('/user/api/showuser',auth.authentication, async function(req, res){
        try{
            const response=await userController.showUser(req.body.userId,req.body);
            console.log("response",JSON.stringify(response));
            res.send(response);
        }
        catch(err){
            console.log(err);
            res.send(err);
    
        }
    
    
    });



   
    
    









module.exports = router;