import { enablePromise, openDatabase } from "react-native-sqlite-storage";

const TABLE_NAME = "chat";

export const getDBConnection = async () => {
  return openDatabase({ name: "chatDB.db", location: "default" });
};

export const createTable = async (db) => {
  // create table if not exist
  const query = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        senderUID varchar(255) NOT NULL,
        receiverUID varchar(255) NOT NULL,
        message varchar(255) NOT NULL,
        timestamp varchar(255) NOT NULL
    );`;
  await db.executeSql(query);
};

export const deleteTable = async (db) => {
  const query = `DROP TABLE ${TABLE_NAME}`;
  return db.executeSql(query);
};

export const getMyChat = async (db, myUID, otherUID) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE senderUID='${myUID}' AND receiverUID='${otherUID}';`;
  return db.executeSql(query);
};

export const getOtherChat = async (db, myUID, otherUID) => {
  const query = `SELECT * FROM ${TABLE_NAME};`;
  return db.executeSql(query);
};

export const addChat = async (db, myUID, otherUID, message, timestamp) => {
  const query = `INSERT INTO ${TABLE_NAME} VALUES ('${myUID}', '${otherUID}', '${message}', '${timestamp}')`;
  return db.executeSql(query);
};

export const getLatestChat = async (db, myUID, otherUID) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE senderUID='${myUID}' AND receiverUID='${otherUID}' ORDER BY timestamp desc limit 1`;
  return db.executeSql(query);
};

enablePromise(true);
