import { createContext, useState, useContext } from 'react';
import { useCookies } from 'react-cookie';

const APIContext = createContext({});

const APIContextProvider =  function ({ children }) {
  // Initialize state
  const [backendURL, setBackendURL] = useState("http://127.0.0.1:8000");
  const [authPrefix, setAuthPrefix] = useState("Token");
  const [cookies, setCookie] = useCookies(['token']);

  return (
    <APIContext.Provider value={{ backendURL, authPrefix, cookies, setCookie}}>
      {children}
    </APIContext.Provider>
  );
};

export default APIContextProvider;


// Create a hook to use the APIContext, this is a Kent C. Dodds pattern
export function useAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}