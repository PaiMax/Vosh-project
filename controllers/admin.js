const webRequest=require('request-promise');
const config=require('../config/config');
// const axios=require('axios');
const sqlDb=require('../model/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');



exports.signUp=async(req)=>{
    try{
      const api={
        message:""
      }
        if(req.body.hasOwnProperty("name")&&req.body.hasOwnProperty("password")&&req.body.hasOwnProperty("email")){
          
    
    
          const name=req.body.name;
          const password=req.body.password;
          const email=req.body.email;
          console.log("password",typeof password);
          console.log("password", password);

          const hashPassword=await bcrypt.hash(password,10);
          console.log("hashPassword",hashPassword);
          let conn;
          conn=await sqlDb.doConnect();
          const seacrhQuery={
            sql:"Select * from admin where email=?",
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
            sql:"insert into admin(name,email,password)values (?,?,?)",
            bindParams:[name,email,hashPassword]
          }
          const sql=insertQuery.sql;
          const bindParameters= insertQuery.bindParams;
          const rows=await sqlDb.executeSql(conn,sql,bindParameters);
          console.log(rows.insertId);
          await sqlDb.doRelease(conn);
          api.message="admin user created sucessfully";
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


exports.login=async (req)=>{
    try{
      const api={
        message:"",
        token:""
      }
      console.log("in admin login");
      const email=req.email;
      let conn;
      console.log(email);
      conn=await sqlDb.doConnect();
      const seacrhQuery={
        sql:"Select password from admin where email=?",
        bindParams:[email]

      }
      const searchSql=seacrhQuery.sql;
      const parameters= seacrhQuery.bindParams;
      const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);
      console.log(JSON.stringify(searchResult));
      if(searchResult.length==1){
        console.log("type of ====",typeof req.password);
        console.log("pasword====", searchResult[0].password);
        const value=await bcrypt.compare(req.password,searchResult[0].password);
        
        console.log(value);
        if(value){
          var tokenRequest = {
            adminId: searchResult[0].idadmin,             
            create_ts: new Date(),
          };
          
          var token = jwt.sign(tokenRequest, config.auth.SECRET, {           //create a token using jwt
            algorithm: "HS256",
          });
          api.message="login succefull"
          api.token= token;
          console.log(JSON.stringify(api));
          await sqlDb.doRelease(conn);
          return Promise.resolve(api);
        }
        api.message="Incorrect password";
        return Promise.reject(api);
      }
      else{
        api.message="User not found please register";
        return Promise.reject(api);
      }
      
    }
    catch(err){
      console.log(err);
      api.message="error occurs";
      return Promise.reject(api);
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
      
      user[i]={
        userName:searchResult[0].name,
        bio:searchResult[0].bio,
        phone:searchResult[0].phone}


    }
    await sqlDb.doRelease(conn);
    return Promise.resolve(api);

    

    
    

  }
  catch(err){
    return Promise.reject(err);
  }
}