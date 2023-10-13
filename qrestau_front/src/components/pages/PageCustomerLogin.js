import React, {useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";

function PageCustomerLogin() {
  // eslint-disable-next-line
  const {backendURL, saveToken} = useAPI();
  const { table_id } = useParams();

  const errorDisplayRef = useRef();
  const navigate = useNavigate();

  const CustomerLoginSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
  });

  const handleCustomerLogin = function(payload) {
    try {
      //reset error msg if any
      errorDisplayRef.current.innerText = "";

      let axios_conf = {
        method: "post",
        url: `${backendURL}/api/login/${table_id}`,
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        saveToken(response.data.auth_token);
        navigate(`/customer/tables/${table_id}/meals/${response.data.meal_id}/menu`);
      })
      .catch((error) => {
        // let error_msg = "";

        // if( 'non_field_errors' in error.response.data) {
        //   error_msg = error.response.data.non_field_errors.join('<br/>');
        // } else {
        //   error_msg = error;
        // }

        console.log(error)

        errorDisplayRef.current.innerText = error;
      });
    } catch (error) {
      errorDisplayRef.current.innerText = error;
    }
  }



  return (
    <>
      <h1>Welcome to nani nana</h1>

      <div>Please enter the password for your table to start ordering</div>


      <div className="details__form">
        <Formik
          initialValues={{
            password: '',
          }}
          onSubmit={handleCustomerLogin}
          validationSchema={CustomerLoginSchema}
        >
          {({ errors, touched }) => (
            <Form className="form">
              <div className="form__row">
                <label htmlFor="password" className="form__label">Password</label>
                <Field id="password" name="password" type="text" className="form__input"/>
                <ErrorMessage component="div" name="password" className="form__field-error"/>
              </div>
              <div className="form__row">
                <button className="button" type="submit">
                  Start ordering
                </button>
              </div>

              <div className="form__error" ref={errorDisplayRef}></div>
            </Form>
          )}
        </Formik>
      </div>

    </>
  )
}

export default PageCustomerLogin;