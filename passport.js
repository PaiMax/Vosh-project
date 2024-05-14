const GoogleStrategy=require("passport-google-oauth20").Strategy;
const passport=require('passport');
const config=require('./config/config');
const sqlDb=require('./model/db');
console.log(" ddd",config.google.Client_ID)
console.log(" ddd",config.google.Client_secret);


passport.use(new GoogleStrategy(
    {
        clientID:config.google.Client_ID,
        clientSecret:config.google.Client_secret,
        callbackURL:'http://localhost:6001/api/googlecallback',
        scope:["profile","email"],


},
  
async function (accessToken,refreshToken,profile,callback){
    console.log('Profile data');
    console.log(profile);
    const email=profile.emails[0].value;
    let conn;
    conn=await sqlDb.doConnect();
    const seacrhQuery={
        sql:"Select * from user where email=?",
        bindParams:[email]

      }
      const searchSql=seacrhQuery.sql;
      const parameters= seacrhQuery.bindParams;
      const searchResult=await sqlDb.executeSql(conn,searchSql,parameters);
      if(searchResult.length==0){
        const name=profile.displayName;
        const userId=profile.id;
        
        const insertQuery={
            sql:"insert into user(googlesinginId,name,email)values (?,?,?)",
            bindParams:[userId,name,email]
          }
          const sql=insertQuery.sql;
          const bindParameters= insertQuery.bindParams;
          const rows=await sqlDb.executeSql(conn,sql,bindParameters);
          console.log(rows.insertId);
          

        
      }
      await sqlDb.doRelease(conn);


    callback(null,profile);
}) )


passport.serializeUser((user,done)=>{
    done(null,user);
})
passport.deserializeUser((user,done)=>{
    done(null,user);
})