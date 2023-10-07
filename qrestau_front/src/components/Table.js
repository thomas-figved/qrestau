import {React, useState, useEffect} from "react";
import { useCookies } from 'react-cookie';

function Table(props) {

  useEffect(()=>{
  },[])

  const handleCloseTable = function(e) {

  }

  const handleOpenTable = function(e) {

  }


  return (
    <div className="table">
      <h2 className="table__title">{props.title}</h2>

      <div className="table__button">
        <button className="button">
          <i class="fa-solid fa-qrcode"></i>
        </button>
        {
          props.meal == null ?
            <button className="button" onClick={handleOpenTable}>
              Open
            </button>
          :
            <>
              <button className="button" onClick={handleCloseTable}>
                Attend
              </button>
              <button className="button" onClick={handleCloseTable}>
                Close
              </button>
            </>
        }
      </div>

      {
          props.meal !== null ?
          <div className="table__meal">
            <div className="table__meal-date">
              {props.meal.start_datetime}
            </div>
            <div className="table__meal__password">
              {props.meal.password}
            </div>
          </div>
          : ""
        }
    </div>
  );
}

export default Table;
