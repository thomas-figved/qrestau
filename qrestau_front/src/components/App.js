import  'styles/main.scss';

import {React, useEffect, useContext, useState} from "react";
import {Route, Routes } from "react-router-dom";

import PageStaffLogin from 'components/pages/PageStaffLogin'
import {APIEndpointsURL} from 'context'

function App() {

  const endpoints_url = useContext(APIEndpointsURL);
  const [APIEndpoints, setAPIEndpoints] = useState([]);

  useEffect(() => {

    fetch(endpoints_url)
    .then(response => response.json())
    .then(json => {
      let endpoints = [];
      for(let path_url in json.paths) {
        for(let method in json.paths[path_url]) {
          if(method !== "parameters") {
            let endpoint ={}
            console.log(json.paths[path_url][method]['operationId']);
            endpoint[json.paths[path_url][method]['operationId']] = {
              'path': path_url,
              'method': method,
            }
            endpoints.push(endpoint);
          }
        }
      }
      setAPIEndpoints(endpoints);
    })
    .catch(error => console.error(error));
  }, [endpoints_url,setAPIEndpoints]);


  return (
    <div className="page-wrap">
      <Routes>
        <Route element={<PageStaffLogin/>} path="/staff_login"/>
      </Routes>
    </div>
  );
}

export default App;
