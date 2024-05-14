/*
 *******************************************************************************
 *
 * %name:  my_sql.js %
 * %derived_by:  Rakesh Bhandarkar %
 *
 * %version:  1 %
 * %release:  Freeze Booking/1.0 %
 * %date_modified:  Mon Jan 10 12:14:32 2023 %
 *
 * Date          By             Description
 * ------------  -----------    -----------
 * Jan 10, 2022 rakesh 		created
 *******************************************************************************
 */
/*jshint esversion: 6 */
const config = require("../config/config");
const mysql = require("mysql2");
const logger = config.logger;
let pool;

const sqlDb = {};

sqlDb.init = () => {
  return new Promise(resolve => {
    pool = mysql.createPool(config.MYSQL);
    console.log("Initializing Pool");
    
    resolve(pool);
  });
};

sqlDb.doConnect = userId => {
  return new Promise((resolve, reject) => {
    //logger.debug(`${userId}: Getting Connection from Pool : Enter`);
    pool.getConnection(function(err, conn) {
      if (err) {
        logger.error(`${userId}: Getting Connection from Pool : Failed`, err);
        reject(err);
      } else {
        //logger.debug(`${userId}: Getting Connection from Pool : Success`);
        resolve(conn);
      }
    });
  });
};

sqlDb.beginTransaction = (userId, connection) => {
  return new Promise((resolve, reject) => {
    //logger.debug(`${userId}: Transaction Begins : Enter`);
    if (connection) {
      connection.beginTransaction(function(err) {
        if (err) {
          logger.error(`${userId}: Transaction Begins : Failed`, err);
          reject(err);
        } else {
          //logger.debug(`${userId}: Transaction Begins : Success`);
          resolve();
        }
      });
    } else {
      logger.error(`${userId}: Transaction Begins : Failed : No Connection Found`);
      reject();
    }
  });
};

sqlDb.doRelease = (userId, connection) => {
  return new Promise(resolve => {
    //logger.info(`${userId}: Releasing Pool Connection : Enter`);
    if (connection) {
      pool.releaseConnection(connection);
      //logger.info(`${userId}: Releasing Pool Connection : Success`);
      resolve();
    } else {
      //logger.info(`${userId}: Releasing Pool Connection : No Pool Connection Found`);
      resolve();
    }
  });
};

sqlDb.doCommit = (userId, connection) => {
  return new Promise((resolve, reject) => {
    //logger.info(`${userId}: Executing Commit : Enter`);
    if (connection) {
      connection.commit(function(err) {
        if (err) {
          logger.error(`${userId}: Executing Commit : Failed`, err);
          reject(err);
        } else {
          //logger.info(`${userId}: Executing Commit : Success`);
          resolve();
        }
      });
    } else {
      logger.error(`${userId}: Executing Commit : Failed : No Connection Found`);
      reject();
    }
  });
};

sqlDb.doRollback = (userId, connection) => {
  return new Promise((resolve, reject) => {
    //logger.info(`${userId}: Executing Rollback : Enter`);
    if (connection) {
      connection.rollback(function(err) {
        if (err) {
          logger.error(`${userId}: Executing Rollback : Failed`, err);
          reject(err);
        } else {
          logger.info(`${userId}: Executing Rollback : Success`);
          resolve();
        }
      });
    } else {
      logger.error(`${userId}: Executing Rollback : Failed : No Connection Found`);
      reject();
    }
  });
};

sqlDb.terminateConnection = () => {
  return new Promise((resolve, reject) => {
    pool.end(function(err) {
      if (err) {
        console.log("Failed to terminate Pool");
        reject(err);
      } else {
        console.log("DB Pool Terminated Successfully");
        resolve();
      }
    });
  });
};

sqlDb.executeSql = async (userId, conn, sql, bindParameters) => {
  try {
    const formattedSql = conn.format(sql, bindParameters);
    logger.info(`${userId}: Executing SQL : ${formattedSql}`);
    const [queryResult] = await conn.promise().query(formattedSql);
    //logger.info(`${userId}:  Query Result :`, queryResult);
    return Promise.resolve(queryResult);
  } catch (err) {
    logger.error(`${userId}: Failed to Execute SQL`, JSON.stringify(err));
    return Promise.reject(err);
  }
};
module.exports = sqlDb;
