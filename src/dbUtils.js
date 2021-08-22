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

export const getMyChatMessages = async (db, senderId, receiverId) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE senderUID='${senderId}' AND receiverUID='${receiverId}';`;
  return db.executeSql(query);
};

export const getOtherChatMessages = async (db, senderId, receiverId) => {
   const query = `SELECT * FROM ${TABLE_NAME} WHERE senderUID='${receiverId}' AND receiverUID='${senderId}';`;
  return db.executeSql(query);
};

export const saveMessage = async (db, senderId, receiverId, message, timestamp) => {
  const query = `INSERT INTO ${TABLE_NAME} VALUES ('${senderId}', '${receiverId}', '${message}', '${timestamp}')`;
  return db.executeSql(query);
};

export const getLatestChatMessage = async (db, senderId, receiverId) => {
  const query = `SELECT * FROM ${TABLE_NAME} WHERE senderUID='${senderId}' AND receiverUID='${receiverId}' ORDER BY timestamp desc limit 1`;
  return db.executeSql(query);
};

enablePromise(true);
