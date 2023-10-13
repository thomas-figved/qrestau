import {React, useState, useEffect, useRef, useCallback} from "react";
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import { NavLink, useParams} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import QRCode from "react-qr-code";
import ReactToPrint from 'react-to-print';

import {useAPI} from 'contexts/APIContext';

function PageStaffTableDetails(props) {
  const [cookies] = useCookies([['token']]);
  const {backendURL} = useAPI();

  const [table, setTable] = useState(null);
  const { table_id } = useParams();

  const [showForm, setShowForm] = useState(false);

  const errorDisplayRef = useRef();
  const qrcodeRef = useRef();

  const OpenTableSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
  });

  const fetch_table_data = useCallback(function() {
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
  },[setTable, cookies, backendURL, table_id]);

  useEffect(()=>{
    fetch_table_data();
  },[fetch_table_data])


  const handleShowForm = function(e) {
    setShowForm(true);
  }

  const confirmCloseTable = function() {
    confirmAlert({
      title: 'Closing meal.',
      message: 'Are you sure you want to end this meal ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleCloseTable()
        },
        {
          label: 'No',
          onClick: () => alert('Click No')
        }
      ]
    });
  }

  const handleCloseTable = function() {
    try {
      //reset error msg if any
      errorDisplayRef.current.innerText = "";

      let axios_conf = {
        method: "delete",
        url: backendURL + "/api/meals/" + table.meal.id,
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        fetch_table_data();
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

  const handleOpenTable = function(payload) {
    try {
      //reset error msg if any
      errorDisplayRef.current.innerText = "";

      let axios_conf = {
        method: "post",
        url: backendURL + "/api/meals",
        data: payload,
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        fetch_table_data();
        setShowForm(false);
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
    <>
      <div className="page-wrap__back">
        <NavLink to={`/staff/dashboard`} className="button">
          Back
        </NavLink>
      </div>

      <h1 className="page-wrap__title">Table: {table.title}</h1>

      {
        table.meal !== null ?
        <div className="page-wrap__description">
          <dl className="description">
            <dt className="description__term">
              Started at:
            </dt>
            <dd className="description__detail">
              {table.meal.start_datetime}
            </dd>
          </dl>
          <dl className="description">
            <dt className="description__term">
              Password
            </dt>
            <dd className="description__detail">
              {table.meal.password}
            </dd>
          </dl>
        </div>
        : ""
      }

      

      {
        showForm ?
          <div className="page-wrap__form">
            <Formik
              initialValues={{
                table_id: table_id,
                password: '',
              }}
              onSubmit={handleOpenTable}
              validationSchema={OpenTableSchema}
            >
              {({ errors, touched }) => (
                <Form className="form">
                  <div className="form__row">
                    <label htmlFor="password" className="form__label">Password</label>
                    <Field id="password" name="password" type="text" className="form__input"/>
                    <ErrorMessage component="div" name="password" className="form__field-error"/>
                  </div>
                  <input type="hidden" name="table_id" value={table_id} />
                  <div className="form__row">
                    <button className="button" type="submit">
                      Confirm creation
                    </button>
                  </div>
                  <div className="form__error" ref={errorDisplayRef}></div>
                </Form>
              )}
            </Formik>
          </div>
        : ""
      }

      <div className="page-wrap__button">
        {
          table.meal == null ?
            <button className="button" onClick={handleShowForm}>
              Start new meal
            </button>
          :
            <>
              <NavLink to={`/customer/tables/${table.id}/meals/${table.meal.id}/order`} className="button">
                Ordered items
              </NavLink>
              <NavLink to={`/customer/tables/${table.id}/meals/${table.meal.id}/menu`} className="button">
                Menu
              </NavLink>
              <button className="button button--error" onClick={confirmCloseTable}>
                Close meal
              </button>
            </>
        }
      </div>

      <div className="page-wrap__qrcode">
        <QRCode
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={`${window.location.host}/customer/tables/${table.id}`}
          ref={qrcodeRef}
        />
        <div className="page-wrap__qrcode-print">
          <ReactToPrint
            trigger={() => {
              return <button href="#" className="button"> <i className="fa-solid fa-print"></i> Print</button>;
            }}
            content={() => qrcodeRef.current}>
          </ReactToPrint>
        </div>
      </div>
    </>
  );
}

export default PageStaffTableDetails;
