import React, { createContext, useEffect, useState, useContext } from 'react';
import { Server } from 'p2p-client-js';
import { UserInfoContext } from './UserInfo';

const MatrixServerContext = createContext(null);

const MatrixServerProvider = ({ children }) => {
  const [server, setServer] = useState();
  const baseUrl = "http://matrix.org";
  const { username, setContacts } = useContext(UserInfoContext);

  useEffect(() => {
    const newServer = new Server({
      baseUrl,
    });
    setServer(newServer);
  }, []);

  const setServerUrl = (url) => {
    const newServer = new Server({baseUrl: url})
    setServer(newServer)
    return newServer;
  };

  const updateContacts = (server) => {
    const rooms = server.getRooms();
    const reqRoomsInfo = rooms.map(room => {
      try {
        const members = room.currentState._displayNameToUserIds;
        const otherMember = Object.keys(members).filter(key => !members[key][0].startsWith('@'+username))[0];
        return {
          id: members[otherMember][0],
          name: otherMember
        }
      } catch (e) {
        return undefined;
      }
    }).filter(data => data)
    setContacts(reqRoomsInfo);
  }
  if(!server) return null;
  return (
    <MatrixServerContext.Provider value={{setServerUrl, server, updateContacts}}>{children}</MatrixServerContext.Provider>
  );
}

export { MatrixServerContext, MatrixServerProvider };