import { createContext, useState, useContext, useEffect} from 'react';
import { useCookies } from 'react-cookie';

const APIContext = createContext({});

const APIContextProvider =  function ({ children }) {
  // Initialize state
  const [backendURL] = useState("http://127.0.0.1:8000");
  const [authPrefix] = useState("Token");
  const [user, setUser] = useState(null);

  const [cookies, setCookie] = useCookies();

  const [isStaff, setIsStaff] = useState(false);


  useEffect(()=>{
    if(user != null) {
      if(user.groups.length > 0) {
        setIsStaff(user.groups.some((group)=> group.name === "staff"));
      }
    }
  },[user, setIsStaff])

  const provided = {
    backendURL,
    authPrefix,
    cookies,
    setCookie,
    user,
    setUser,
    isStaff,
  }

  return (
    <APIContext.Provider value={provided}>
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