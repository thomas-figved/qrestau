import {React, useRef, useEffect} from "react";
import { useCookies } from 'react-cookie';
import {useNavigate} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";

function PageStaffLogin() {
  const [cookies, setCookies] = useCookies(['token']);
  const errorDisplayRef = useRef();
  const navigate = useNavigate();
  const {backendURL} = useAPI();

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

      let axios_conf = {
        method: "post",
        url: backendURL + "/auth/token/login",
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        setCookies('token', response.data.auth_token);
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
      });
    } catch (error) {
      errorDisplayRef.current.innerText = error;
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        onSubmit={handleLoginStaff}
        validationSchema={StaffLoginSchema}
      >
        {({ errors, touched }) => (
          <Form className="form-login">
            <div className="form-login__row">
              <label htmlFor="username" className="form-login__label">Username</label>
              <Field id="username" name="username" placeholder="Staff1" className="form-login__input"/>
              <ErrorMessage component="div" name="username" className="form-login__field-error"/>
            </div>
            <div className="form-login__row">
              <label htmlFor="password" className="form-login__label">Password</label>
              <Field id="password" name="password" type="password" className="form-login__input"/>
              <ErrorMessage component="div" name="password" className="form-login__field-error"/>
            </div>
            <div className="form-login__row">
              <button className="button" type="submit">
                Login
              </button>
            </div>

            <div className="form-login__error" ref={errorDisplayRef}></div>
          </Form>
        )}
      </Formik>

    </>
  );
}

export default PageStaffLogin;
