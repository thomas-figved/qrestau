import {React, useEffect, useState} from "react";

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
  const {fetchData} = useAPI();

  const [tables, setTables] = useState([]);

  useEffect(()=>{

    const successCallback = (response) => {
      setTables(response.data);
    }

    fetchData({
      path: "/api/tables",
      method: "get",
      needsAuth: true,
      successCallback: successCallback,
    })
  },[fetchData])

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
