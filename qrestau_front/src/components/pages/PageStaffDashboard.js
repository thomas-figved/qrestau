import {React, useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import axios from 'axios';

import {useAPI} from 'contexts/APIContext';
import { NavLink } from "react-router-dom";

import Table from "components/Table"

function PageStaffDashboard() {
  const [cookies, setCookie] = useCookies([['token']]);
  const {backendURL} = useAPI();

  const [tables, setTables] = useState([]);

  const getTableClasses = function (table) {
    let classes=["table"]
    if(table.meal !== null) {
      classes.push("table--close");
    }
    return classes.join(" ");
  }

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
        setTables(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[setTables, cookies, backendURL])

  return (
    <>
      <div className="page-wrap__table">
        { tables.map((table, key)=>{
          return (
            <NavLink 
              to={`/staff/tables/${table.id}`}
              className={getTableClasses(table)}
              key={key}>
              <h2 className="table__title">{table.title}</h2>
            </NavLink>
          )
        })}
      </div>
    </>
  );
}

export default PageStaffDashboard;
