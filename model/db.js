const config=require("../config/config");
const mysql=require('mysql2');
let pool;
const sqlDb={};


sqlDb.init=()=>{
    return new Promise(resolve =>{
        pool=mysql.createPool(config.MYSQL);
        console.log("initializing poool");
        resolve(pool);

    })
}
sqlDb.doConnect=()=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,conn){
            if(err){
                console.log(err);

            }
            else{
                resolve(conn);
            }
        });
    });
};



sqlDb.executeSql=async(conn,sql,bindParameters)=>{
    try{
        const formatedSql=conn.format(sql,bindParameters);
        const [queryResult]=await conn.promise().query(formatedSql);
        console.log(JSON.stringify(queryResult)+"query serrr");
        return Promise.resolve(queryResult);
    }
    catch(err){
        console.log(err);
        return Promise.reject(err);
    }
    

    


}


sqlDb.doRelease=(connection)=>{
    return new Promise((resolve,reject) =>{
        if(connection){
            pool.releaseConnection(connection);
            console.log("pool connection released");
            resolve();
        }
        else{
            reject();

        }
    })
}
module.exports=sqlDb;






