import AsyncStorage from "@react-native-async-storage/async-storage";

// LENGTH OF UID
const LENGTH = 5;

export const generateUId = () => {
  let id = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < LENGTH; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
};

export const resetStorage = () => {
  AsyncStorage.clear()
    .then(() => console.log("Cleared storage"))
    .catch((err) => {
      console.error(err);
    });
};

