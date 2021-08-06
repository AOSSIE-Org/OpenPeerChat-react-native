import React, { createContext, useEffect, useState } from 'react';
import { Server } from 'p2p-client-js';

const MatrixServerContext = createContext(null);

const MatrixServerProvider = ({ children }) => {
  const [server, setServer] = useState();
  const [baseUrl, setBaseUrl] = useState("http://matrix.org")

  useEffect(() => {
    const newServer = new Server({
      baseUrl,
    });
    setServer(newServer);
  }, [baseUrl]);

  const setServerUrl = (url) => setBaseUrl(url);

  return (
    <MatrixServerContext.Provider value={{setServerUrl, server}}>{children}</MatrixServerContext.Provider>
  )
}

export { MatrixServerContext, MatrixServerProvider };