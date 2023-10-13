import {React, useRef} from "react";
import {useNavigate} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";

function PageStaffLogin() {
  // eslint-disable-next-line
  const errorDisplayRef = useRef();
  const navigate = useNavigate();
  const {backendURL, saveToken} = useAPI();

  const StaffLoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });

  const handleLoginStaff = async function(payload) {
    try {
      //reset error msg if any
      errorDisplayRef.current.innerText = "";
      errorDisplayRef.current.classList.remove('form__error--show');

      let axios_conf = {
        method: "post",
        url: backendURL + "/auth/token/login",
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        saveToken(response.data.auth_token)
        navigate("/staff/dashboard");
      })
      .catch((error) => {
        let error_msg = "";

        if( 'non_field_errors' in error.response.data) {
          error_msg = error.response.data.non_field_errors.join('<br/>');
        } else {
          error_msg = error;
        }

        errorDisplayRef.current.innerText = error_msg;
        errorDisplayRef.current.classList.add('form__error--show');

      });
    } catch (error) {
      errorDisplayRef.current.innerText = error;
      errorDisplayRef.current.classList.add('form__error--show');

    }
  }

  return (
    <>
      <div className="page-wrap__title">
        <h1 className="title">Staff login page</h1>
      </div>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={handleLoginStaff}
        validationSchema={StaffLoginSchema}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <div className="form__row">
              <label htmlFor="username" className="form__label">Username</label>
              <Field id="username" name="username" className="form__input"/>
              <ErrorMessage component="div" name="username" className="form__field-error"/>
            </div>
            <div className="form__row">
              <label htmlFor="password" className="form__label">Password</label>
              <Field id="password" name="password" type="password" className="form__input"/>
              <ErrorMessage component="div" name="password" className="form__field-error"/>
            </div>
            <div className="form__button">
              <button className="button" type="submit">
                Login
              </button>
            </div>

            <div className="form__error" ref={errorDisplayRef}></div>
          </Form>
        )}
      </Formik>

    </>
  );
}

export default PageStaffLogin;
