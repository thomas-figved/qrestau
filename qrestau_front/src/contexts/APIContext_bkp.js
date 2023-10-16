import { createContext, useState, useContext, useEffect, useCallback} from 'react';
import { useCookies } from 'react-cookie';
import {useNavigate, useLocation} from "react-router-dom";
import axios from 'axios';

const APIContext = createContext({});

const checkToken = (removeCookie, navigate, location, setUser, backendURL, getAuthorizationHeader)=>{
  try {
    let axios_conf = {
      method: "get",
      url: process.env.REACT_APP_BACKEND_URL + "/api/check-token",
      headers: getAuthorizationHeader(),
    };

    let axios_instance = axios.create();

    axios_instance.request(axios_conf)
    .then(function (response) {
      setUser(response.data.user)

      if(response.data.is_staff) {
        if(location.pathname === "/") {
          navigate("/staff/dashboard");
        }
      }
    })
    .catch((error) => {
      //if permission denied it means that the token isn't valid anymore
      if(error.response.status === 403) {
        removeCookie('token', {path:'/'})
        if(location.pathname !== "/") {
          navigate("/");
        }
      }
      console.log(error.response.status);
    });
  } catch (error) {
    console.log(error);
  }
}

const APIContextProvider =  function ({ children }) {
  // Initialize state
  const [backendURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [user, setUser] = useState(null);

  const [cookies, setCookie, removeCookie] = useCookies();

  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()

  const getAuthorizationHeader = useCallback(()=>{
      return { Authorization: `${process.env.REACT_APP_AUTH_PREFIX} ${cookies.token}` }
  },[cookies.token])

  const saveToken = useCallback((token_value)=>{
    setCookie('token', token_value);
  },[setCookie])

  useEffect(()=>{
    if('token' in cookies) {
      checkToken(removeCookie, navigate, location, setUser, backendURL, getAuthorizationHeader);
    }
  },[cookies, removeCookie, navigate, location, backendURL, getAuthorizationHeader])


  useEffect(()=>{
    if(user != null) {
      if(user.groups.length > 0) {
        setIsStaff(user.groups.some((group)=> group.name === "staff"));
      }
    }
  },[user, setIsStaff])

  const provided = {
    backendURL,
    getAuthorizationHeader,
    user,
    setUser,
    isStaff,
    checkToken,
    saveToken,
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