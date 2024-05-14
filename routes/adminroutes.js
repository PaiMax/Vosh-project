const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const auth=require('../middleware/auth')


router.post('/admin/api/register', async function(req, res){
    try{
        const response=await adminController.signUp(req);
        res.send(response.message);
    }
    catch(err){
        console.log(err);
        res.send(err);

    }


});
router.post('/admin/api/login', async function(req, res){
    try{
        const response=await adminController.login(req.body);
        console.log("response",JSON.stringify(response));
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.send(err);

    }


});
router.post('/admin/api/showuser',auth.authentication, async function(req, res){
    try{
        const response=await adminController.showUser(req.body.userId,req.body);
        console.log("response",JSON.stringify(response));
        res.send(response);
    }
    catch(err){
        console.log(err);
        res.send(err);

    }


});
module.exports = router;