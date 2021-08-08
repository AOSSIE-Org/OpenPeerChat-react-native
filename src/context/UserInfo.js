import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserInfoContext = createContext(null);

const UserInfoProvider = ({ children }) => {
  const [username, setUsername] = useState();
  const [otherSavedInfo, setOtherSavedInfo] = useState();
  const [contacts, setContactList] = useState([]);
  const [stateLoaded, setStateLoaded] = useState(false);


  useEffect(() => {
    const init = async () => {
      const json = await AsyncStorage.getItem("userInfo");
      const uInfo = JSON.parse(json);
      setUsername(uInfo.username);
      setOtherSavedInfo(uInfo);
      setStateLoaded(true)
    }
    init();
  }, [AsyncStorage]);

  const setContacts = async (contacts) => {
    await AsyncStorage.setItem("contacts", JSON.stringify(contacts));
    setContactList(contacts);
  }

  const addContact = async (contact) => {
    const newList = [...contacts, contact]
    setContacts(newList);
  }

  return (
    <UserInfoContext.Provider value={{username, otherSavedInfo, contacts, setContacts, addContact}}>{stateLoaded && children}</UserInfoContext.Provider>
  );
}

export { UserInfoContext, UserInfoProvider };