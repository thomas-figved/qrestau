import  'styles/main.scss';

import {React, useEffect, useRef} from "react";
import {Route, Routes, useLocation } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from 'axios';

import PageHome from 'components/pages/PageHome'
import PageStaffLogin from 'components/pages/PageStaffLogin'
import PageStaffDashboard from 'components/pages/PageStaffDashboard'
import PageStaffTableDetails from 'components/pages/PageStaffTableDetails'
import PageCustomerLogin from 'components/pages/PageCustomerLogin'
import PageMenu from 'components/pages/PageMenu'
import PageCart from 'components/pages/PageCart'
import PageOrderedItems from 'components/pages/PageOrderedItems'

import {useAPI} from 'contexts/APIContext';

function App() {
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const {backendURL, user, setUser} = useAPI();
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(()=>{

    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting
    } else {
      return
    }

    if('token' in cookies) {
      try {
        let axios_conf = {
          method: "get",
          url: backendURL + "/api/check-token",
          headers: { Authorization: `Token ${cookies.token}` }
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
  },[cookies, backendURL, navigate, setUser, user, removeCookie, location]);

  return (
    <>
      <header className="header">
        {
          user !== null ?
            <div className="header__login">
              Logged in as {user.username}
            </div>
          :""
        }
      </header>
      <div className="page-wrap">

          <Routes>
            <Route element={<PageHome/>} path="/"/>
            <Route element={<PageStaffLogin/>} path="/staff"/>
            <Route element={<PageStaffTableDetails/>} path="/staff/tables/:table_id"/>
            <Route element = {<PageStaffDashboard/>} path="/staff/dashboard"/>
            <Route element = {<PageCustomerLogin/>} path="/customer/tables/:table_id"/>
            <Route element = {<PageMenu/>} path="/customer/tables/:table_id/meals/:meal_id/menu"/>
            <Route element = {<PageCart/>} path="/customer/tables/:table_id/meals/:meal_id/cart"/>
            <Route element = {<PageOrderedItems/>} path="/customer/tables/:table_id/meals/:meal_id/order"/>
          </Routes>
      </div>
    </>
  );
}

export default App;
