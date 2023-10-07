import {React, useState, useEffect, useRef} from "react";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import { NavLink, useParams} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';

function PageStaffTableDetails(props) {
  const [cookies, setCookie] = useCookies([['token']]);
  const {backendURL} = useAPI();

  const [table, setTable] = useState(null);
  const { table_id } = useParams();

  const [showForm, setShowForm] = useState(false);
  const errorDisplayRef = useRef();

  const OpenTableSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
  });

  useEffect(()=>{
    try {
      let axios_conf = {
        method: "get",
        url: backendURL + "/api/tables/" + table_id,
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        setTable(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[setTable, cookies, backendURL, table_id])

  const handleCloseTable = function(e) {

  }

  const handleOpenTable = function(payload) {
    try {
      //reset error msg if any
      errorDisplayRef.current.innerText = "";

      let axios_conf = {
        method: "post",
        url: backendURL + "/api/meals",
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        setTable(table);
      })
      .catch((error) => {
        let error_msg = "";

        if( 'non_field_errors' in error.response.data) {
          error_msg = error.response.data.non_field_errors.join('<br/>');
        } else {
          error_msg = error;
        }

        errorDisplayRef.current.innerText = error_msg;
      });
    } catch (error) {
      errorDisplayRef.current.innerText = error;
    }
  }

  if(!table) return <p>Fetching...</p>

  return (
    <div className="details">

      <h1 className="details__title">Table: {table.title}</h1>

      {
          table.meal !== null ?
          <div className="details__meal">
            <div className="details__meal-date">
              {table.meal.start_datetime}
            </div>
            <div className="details__meal__password">
              {table.meal.password}
            </div>
          </div>
          : ""
        }

      <div className="details__button">
        <button className="button">
          <i class="fa-solid fa-qrcode"></i>
        </button>
        {
          table.meal == null ?
            <button className="button" onClick={setShowForm(true)}>
              Open
            </button>
          :
            <>
              <button className="button">
                Attend
              </button>
              <button className="button" onClick={handleCloseTable}>
                Close
              </button>
            </>
        }
      </div>

      {
        showForm ?
          <div className="details__form">
            <Formik
              initialValues={{
                username: '',
                password: '',
              }}
              onSubmit={handleOpenTable}
              validationSchema={OpenTableSchema}
            >
              {({ errors, touched }) => (
                <Form className="form-login">
                  <div className="form-login__row">
                    <label htmlFor="password" className="form-login__label">Password</label>
                    <Field id="password" name="password" type="text" className="form-login__input"/>
                    <ErrorMessage component="div" name="password" className="form-login__field-error"/>
                  </div>
                  <input type="hidden" name="table_id" value={table_id} />
                  <div className="form-login__row">
                    <button className="button" type="submit">
                      Login
                    </button>
                  </div>

                  <div className="form-login__error" ref={errorDisplayRef}></div>
                </Form>
              )}
            </Formik>
          </div>
        : ""
      }
    </div>
  );
}

export default PageStaffTableDetails;
