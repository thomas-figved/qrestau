import {React, useEffect, useState} from "react";
import axios from 'axios';

import {useAPI} from 'contexts/APIContext';
import { NavLink } from "react-router-dom";


const getTableClasses = function (table) {
  let classes=["table"]
  if(table.meal !== null) {
    classes.push("table--close");
  }
  return classes.join(" ");
}

function PageStaffDashboard() {
  const {backendURL, getAuthorizationHeader} = useAPI();

  const [tables, setTables] = useState([]);

  useEffect(()=>{
    try {
      let axios_conf = {
        method: "get",
        url: backendURL + "/api/tables",
        headers: getAuthorizationHeader()
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
  },[setTables, getAuthorizationHeader, backendURL])

  return (
    <>
      <div className="page-wrap__title">
        <h1 className="title">Dashboard</h1>
      </div>
      <section className="page-wrap__section section">
        <h2 className="title title--h2">
          Table list
        </h2>

        <div className="section__table">
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
      </section>
    </>
  );
}

export default PageStaffDashboard;
