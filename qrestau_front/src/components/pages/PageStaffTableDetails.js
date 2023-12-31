import {React, useState, useEffect, useRef, useCallback} from "react";


import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import { NavLink, useParams} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import QRCode from "react-qr-code";
import ReactToPrint from 'react-to-print';

import {useAPI} from 'contexts/APIContext';

const subfolder = process.env.REACT_APP_INSTALLATION_SUBFOLDER === "/" ? "": "/"+process.env.REACT_APP_INSTALLATION_SUBFOLDER

function PageStaffTableDetails(props) {
  const {fetchData} = useAPI();

  const [table, setTable] = useState(null);
  const { table_id } = useParams();

  const [showForm, setShowForm] = useState(false);

  const errorDisplayRef = useRef();
  const qrcodeRef = useRef();

  const OpenTableSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
  });

  const fetchTableData = useCallback(function() {

    const successCallback = (response) =>{
      setTable(response.data);
    }

    fetchData({
      path: `/api/tables/${table_id}`,
      method: "get",
      needsAuth: true,
      successCallback: successCallback,
    })
  },[table_id, fetchData]);

  useEffect(()=>{
    fetchTableData();
  },[fetchTableData])


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

    const successCallback = (response) => {
      fetchTableData();
    }

    const errorCallback = (error) => {
      let error_msg = "";

      if( 'non_field_errors' in error.response.data) {
        error_msg = error.response.data.non_field_errors.join('<br/>');
      } else {
        error_msg = error;
      }

      errorDisplayRef.current.innerText = error_msg;
    }

    fetchData({
      path: `/api/meals/${table.meal.id}`,
      method: "delete",
      needsAuth: true,
      successCallback: successCallback,
      errorCallback: errorCallback,
    })
  }

  const handleOpenTable = function(payload) {

    const successCallback = (response) => {
      fetchTableData();
      setShowForm(false);
    }

    const errorCallback = (error) => {
      let error_msg = "";

      if( 'non_field_errors' in error.response.data) {
        error_msg = error.response.data.non_field_errors.join('<br/>');
      } else {
        error_msg = error;
      }

      errorDisplayRef.current.innerText = error_msg;
    }

    fetchData({
      path: `/api/meals`,
      method: "post",
      needsAuth: true,
      payload: payload,
      successCallback: successCallback,
      errorCallback: errorCallback,
    })
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
              Meal started at:
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
        :
        <div className="page-wrap__qrcode">
          <QRCode
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={`${window.location.protocol}//${window.location.host}${subfolder}/customer/tables/${table.id}`}
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
      }

      <div className="page-wrap__action-bar">
        <div className="action-bar">
          {
          table.meal == null ?
            <button className="button" onClick={handleShowForm}>
              Start meal
            </button>
          :
            <>
              <button className="button button--error" onClick={confirmCloseTable}>
                End
              </button>
              <NavLink to={`/customer/tables/${table.id}/meals/${table.meal.id}/order`} className="button">
                Ordered
              </NavLink>
              <NavLink to={`/customer/tables/${table.id}/meals/${table.meal.id}/menu`} className="button">
                Menu
              </NavLink>
            </>
          }
        </div>
      </div>
    </>
  );
}

export default PageStaffTableDetails;
