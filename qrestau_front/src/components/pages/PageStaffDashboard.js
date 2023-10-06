import {React, useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import axios from 'axios';

import {useAPI} from 'contexts/APIContext';
import { NavLink } from "react-router-dom";
// import Tables from "components/staff/Tables"

function PageStaffDashboard() {
  const [cookies, setCookie] = useCookies([['token']]);
  const {backendURL} = useAPI();

  const [tables, setTables] = useState();

  useEffect(()=>{
    try {
      let axios_conf = {
        method: "get",
        url: backendURL + "/api/tables",
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[setTables])

  return (
    <div className="dashboard">
      <div className="dashboard__table">
        <div className="table">
          <h2 className="table__title">Title</h2>

          <button >
            Open
          </button>
        </div>

        <div className="table">
          <h2 className="table__title">Title</h2>
          {/* 
            <NavLink>
              Attend
            </NavLink> 
          */}
        </div>
      </div>
    </div>
  );
}

export default PageStaffDashboard;
