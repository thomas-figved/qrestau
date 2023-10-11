import  'styles/main.scss';

import {React, useEffect, useState} from "react";
import {Route, Routes } from "react-router-dom";
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
  const [cookies] = useCookies([['token']]);
  const navigate = useNavigate();
  const {backendURL} = useAPI();

  const [user, setUser] = useState(null);

  useEffect(()=>{
    if('token' in cookies && user === null) {
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
            navigate("/staff/dashboard");
            //Don't redirect if we are not on homepage
          }else {
            //TODO redirect non staff to their menu page
          }
        })
        .catch((error) => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    }
  },[cookies, backendURL, navigate, setUser, user]);

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
          <Route element = {<PageCustomerLogin/>} path="/customer/:table_id"/>
          <Route element = {<PageMenu/>} path="/customer/tables/:table_id/meals/:meal_id/menu"/>
          <Route element = {<PageCart/>} path="/customer/tables/:table_id/meals/:meal_id/cart"/>
          <Route element = {<PageOrderedItems/>} path="/customer/tables/:table_id/meals/:meal_id/order"/>
        </Routes>
      </div>
    </>
  );
}

export default App;
