import {React, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";

import {useAPI} from 'contexts/APIContext';
import {useAuth} from 'contexts/AuthContext';


function Login({forStaff}) {
  const errorDisplayRef = useRef();
  const navigate = useNavigate();
  const {fetchData} = useAPI();
  const {saveToken} = useAuth();
  const { table_id } = useParams();

  let LoginSchema = Yup.object().shape({
    password: Yup.string()
      .required('Required'),
  });

  if(forStaff) {
    LoginSchema['username'] = Yup.string().required('Required')
  }

  const successCallback = (response)=>{
    saveToken(response.data.auth_token)

    if(forStaff) {
      navigate("/staff/dashboard");
    } else {
      navigate(`/customer/tables/${table_id}/meals/${response.data.meal_id}/menu`);
    }
  }

  const errorCallback = (error)=>{
    let error_msg = "";

    if( 'non_field_errors' in error.response.data) {
      error_msg = error.response.data.non_field_errors.join('<br/>');
    } else {
      error_msg = error;
    }

    errorDisplayRef.current.innerText = error_msg;
    errorDisplayRef.current.classList.add('form__error--show');
  }


  const handleLogin = async function(payload) {

    const path = forStaff ? `/auth/token/login`: `/api/login/${table_id}`
    const method = 'post'
    fetchData({
      path: path,
      method: method,
      needsAuth: false,
      payload: payload,
      successCallback: successCallback,
      errorCallback: errorCallback,
    })
  }


  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={handleLogin}
      validationSchema={LoginSchema}
    >
      {({ errors, touched }) => (
        <Form className="form">
          {
            forStaff &&
            <div className="form__row">
              <label htmlFor="username" className="form__label">Username</label>
              <Field id="username" name="username" className="form__input"/>
              <ErrorMessage component="div" name="username" className="form__field-error"/>
            </div>
          }

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
  )
}

export default Login;
