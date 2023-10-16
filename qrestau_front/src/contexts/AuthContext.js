import { createContext, useState, useContext, useEffect, useCallback} from 'react';
import { useCookies } from 'react-cookie';
import {useNavigate, useLocation} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';

const AuthContext = createContext({});

const checkTokenPath = '/api/check-token'
const checkTokenMethod = 'get'

const AuthContextProvider =  function ({ children }) {
  // Initialize state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies();
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()
  const { fetchData} = useAPI()

  const successCallback = useCallback((response)=> {
    setUser(response.data.user)
    setIsAuthenticated(true)

    if(response.data.is_staff) {
      if(location.pathname === "/") {
        navigate("/staff/dashboard");
      }
    }
  },[location, navigate])

  const errorCallback = useCallback((error)=> {
    //if permission denied it means that the token isn't valid anymore
    if('response' in error) {

      if(error.response.status === 403) {
        removeCookie('token', {path:'/'})
        if(location.pathname !== "/") {
          navigate("/");
        }
      }
    }

    console.log(error);
  }, [navigate, location, removeCookie])

  const checkToken = useCallback(()=>{
    fetchData({
      path:checkTokenPath, 
      method:checkTokenMethod, 
      needsAuth:true, 
      successCallback:successCallback, 
      errorCallback:errorCallback
    })
  },[fetchData, successCallback, errorCallback])


  const saveToken = useCallback((token_value)=>{
    setCookie('token', token_value);
  },[setCookie])

  useEffect(()=>{
    if(!isAuthenticated) {
      if('token' in cookies) {
        checkToken();
      }
      else {
        //TODO redirect to login
      }
    }
  },[cookies, checkToken, isAuthenticated])


  useEffect(()=>{
    if(user != null) {
      if(user.groups.length > 0) {
        setIsStaff(user.groups.some((group)=> group.name === "staff"));
      }
    }
  },[user])


  const provided = {
    user,
    setUser,
    isStaff,
    checkToken,
    saveToken,
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