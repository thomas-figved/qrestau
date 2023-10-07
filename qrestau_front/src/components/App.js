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

import {useAPI} from 'contexts/APIContext';

function App() {
  const [cookies, setCookie] = useCookies([['token']]);
  const navigate = useNavigate();
  const {backendURL} = useAPI();

  const [user, setUser] = useState({});

  useEffect(()=>{
    if('token' in cookies && !'username' in cookies) {
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
          }else {
            //TODO redirect non staff to its menu page
          }
        })
        .catch((error) => {
          console.log(error);
        });
      } catch (error) {
        console.log(error);
      }
    }
  },[cookies, backendURL, navigate, setUser]);

  return (
    <>
      <header className="header">
        {
          "username" in user ?
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
        </Routes>
      </div>
    </>
  );
}

export default App;
