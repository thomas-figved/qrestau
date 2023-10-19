import { createContext, useState, useContext, useEffect, useCallback} from 'react';
import { useCookies } from 'react-cookie';

import {useAPI} from 'contexts/APIContext';

const AuthContext = createContext({});

const AuthContextProvider =  function ({ children }) {
  // Initialize state
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isStaff, setIsStaff] = useState(false);
  const [authorizedTableId, setAuthorizedTableId] = useState(null);
  const [authorizedMealId, setAuthorizedMealId] = useState(null);
  const { fetchData} = useAPI()
  const [isLoading, setIsLoading] = useState(null)

  const logout = useCallback(()=>{
    removeCookie('token', {path:'/'})
    setIsAuthenticated(false)
    setUser(null)
    setIsStaff(false)
  },[removeCookie])

  const checkToken = useCallback(()=>{

    const checkTokenPath = '/api/check-token'
    const checkTokenMethod = 'get'

    const checkTokenSuccessCallback = (response)=> {
      setUser(response.data.user)
      setIsAuthenticated(true)
      setAuthorizedTableId(response.data.authorized_table_id)
      setAuthorizedMealId(response.data.authorized_meal_id)

      if(response.data.is_staff) {
        setIsStaff(true)
      }

      setIsLoading(false)
    }

    const checkTokenErrorCallback = (error) => {
      //if permission denied it means that the token isn't valid anymore
      if('response' in error) {
        if(error.response.status === 403) {
          logout()
        }
      }
    }

    setIsLoading(true)

    fetchData({
      path: checkTokenPath,
      method: checkTokenMethod,
      needsAuth: true,
      successCallback: checkTokenSuccessCallback,
      errorCallback: checkTokenErrorCallback
    })
  },[fetchData, logout])


  const saveToken = useCallback((token_value)=>{
    setCookie('token', token_value);
  },[setCookie])

  useEffect(()=>{
    if('token' in cookies) {
      checkToken();
    } else {
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      setIsStaff(false)
    }
  },[cookies, checkToken])

  const provided = {
    user,
    setUser,
    isStaff,
    checkToken,
    saveToken,
    isAuthenticated,
    authorizedTableId,
    authorizedMealId,
    isLoading,
    logout,
  }

  return (
    <AuthContext.Provider value={provided}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;


// Create a hook to use the APIContext, this is a Kent C. Dodds pattern
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}