import { createContext, useState, useContext, useCallback} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const APIContext = createContext({});

const APIContextProvider =  function ({ children }) {
  // Initialize state
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [cookies] = useCookies();

  const defaultErrorCallback = (error)=>{
    console.log(error)
  }

  const fetchData = useCallback(({path, method, needsAuth, payload={}, successCallback, errorCallback=defaultErrorCallback}) => {
    setIsLoading(true)

    try {
      let axios_conf = {
        method: method,
        url: process.env.REACT_APP_BACKEND_URL + path,
        data: payload,
      }

      if(needsAuth) {
        axios_conf['headers'] = { Authorization: `${process.env.REACT_APP_AUTH_PREFIX} ${cookies.token}` }
      }

      let axios_instance = axios.create()

      axios_instance.request(axios_conf)
      .then((response)=>{
        successCallback(response)
        setIsLoading(false)
        setError(null);
      })
      .catch((responseError)=>{
        setError(errorCallback(responseError))
        setIsLoading(false)
      })
    } catch (responseError) {
      setError(errorCallback(responseError))
      setIsLoading(false)
    }
  },[cookies])


  const provided = {
    error,
    isLoading,
    fetchData,
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