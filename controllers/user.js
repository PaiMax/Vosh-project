const webRequest=require('request-promise');
const config=require('../config/config');
// const axios=require('axios');
const sqlDb=require('../model/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');





exports.login=async (req)=>{
    try{
      const api={
        message:"",
        token:""
      }
      const email=req.email;
      let conn;
      conn=await sqlDb.doConnect();
      const seacrhQuery={
        sql:"Select password from user where email=?",
        bindParams:[email]

      }
      const searchSql=seacrhQuery.sql;
      const parameters= seacrhQuery.bindParams;
      const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);
      if(searchResult.length==1){
        const value=await bcrypt.compare(req.password,searchResult[0].password);
        if(value ==true){
          var tokenRequest = {
            userId: searchResult[0].iduser,             
            create_ts: new Date(),
          };
          
          var token = jwt.sign(tokenRequest, config.auth.SECRET, {           //create a token using jwt
            algorithm: "HS256",
          });
          api.message="login succefull"
          api.token= token;
          return Promise.resolve(api);
        }
      }
      else{
        api.message="User not found please register";
        return Promise.reject(api);
      }
      await sqlDb.doRelease(conn);
    }
    catch(err){
      console.log(err);
      api.message="error occurs";
    }
}





exports.signUp=async(req)=>{
  try{
    if(req.body.hasOwnProperty("name")&&req.body.hasOwnProperty("password")&&req.body.hasOwnProperty("email")){
      const api={
        message:""
      }


      const name=req.body.name;
      const password=req.body.password;
      const email=req.body.email;
      const hashPassword=await bcrypt.hash(password,10);
      let conn;
      conn=await sqlDb.doConnect();
      const seacrhQuery={
        sql:"Select * from user where email=?",
        bindParams:[email]

      }
      const searchSql=seacrhQuery.sql;
      const parameters= seacrhQuery.bindParams;
      const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);


      if(searchResult.length>0){
        api.message="This email is already exist please try with some other email";
        return Promise.reject(api);

      }


      const insertQuery={
        sql:"insert into user(name,email,password)values (?,?,?)",
        bindParams:[name,email,hashPassword]
      }
      
      
      const sql=insertQuery.sql;
      const bindParameters= insertQuery.bindParams;
      const rows=await sqlDb.executeSql(conn,sql,bindParameters);
      console.log(rows.insertId);
      await sqlDb.doRelease(conn);
      api.message="user created sucessfully";
      return Promise.resolve(api);
      


    
    }
      else{
        api.message="all filds are mandatory";
        return Promise.reject(api);
    }
  
  }
  catch(err){
    console.log(err);
    api.message="Something bad happens";
        return Promise.reject(api);
  }
  


    

    





    
}
exports.genratetoken=async(req)=>{
  try{
    const api={
      message:"",
      token:""
    }
    let conn;
    let email=req.emails[0].value;
    conn=await sqlDb.doConnect();
    const seacrhQuery={
      sql:"Select * from user where email=?",
      bindParams:[email]
  
    }
   
    const searchSql=seacrhQuery.sql;
    const parameters= seacrhQuery.bindParams;
    const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);
    var tokenRequest = {
      userId: searchResult[0].googlesinginId,             
      create_ts: new Date(),
    };
    var token = jwt.sign(tokenRequest, config.auth.SECRET, {           //create a token using jwt
      algorithm: "HS256",
    });
    api.message="login succefull"
    api.token= token;
    return Promise.resolve(api);
  }
  catch(err){
    return Promise.reject(err);
  }
  



}


exports.insertDetails=async(user,req)=>{
  try{
    const api={
      message:""
    }
    let conn;
    conn=await sqlDb.doConnect();
    const id =user;
    const name=req.name;
    const bio=req.bio;
    const phone=req.phone;
    const acctype=req.accountType=='null'?'private':'public';


    const insertQuery={
      sql:"insert into userdetails(name,iduserdetails,accountType,phone)values (?,?,?,?)",
      bindParams:[name,id,acctype,phone]
    }
    const searchSql=seacrhQuery.sql;
    const parameters= seacrhQuery.bindParams;
    const insertResult=await sqlDb.executeSql(conn,searchSql,parameters);
    api.message="all deatails inserted"
    await sqlDb.doRelease(conn);
    return Promise.resolve(api);

    


  }
  catch(err){
    return Promise.reject(err);

  }
}




exports.showUser=async(user,req)=>{
  try{

    const api={
      message:"",
      users:[]
    }
    let conn;
    conn=await sqlDb.doConnect();
    const seacrhQuery={
      sql:"Select * from userdetails where iduserdetails=?",
      bindParams:[user]
  
    }
   
    const searchSql=seacrhQuery.sql;
    const parameters= seacrhQuery.bindParams;
    const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);
    for(let i=0;i<searchResult.length;i++){
      if(searchResult[0].accountType=='public'){
        user[i]={
          userName:searchResult[0].name,
          bio:searchResult[0].bio,
          phone:searchResult[0].phone}

      }
      


    }
    await sqlDb.doRelease(conn);
    return Promise.resolve(api);

    

    
    

  }
  catch(err){
    return Promise.reject(err);
  }
}