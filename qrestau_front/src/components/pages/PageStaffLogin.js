import {React, useState, useRef, useLayoutEffect, useEffect} from "react";


function PageStaffLogin() {

  const formRef = useRef();

  const handleLoginStaff = function(e) {
    e.preventDefault();

    console.log(formRef.current);
  }


  return (
    <>

      <form className="form-login" ref={formRef}>
        <div className="form-login__row">
          <label htmlFor="username" className="form-login__label">Username</label>
          <input type="text" className="form-login__input" name="username" id="username"/>
        </div>
        <div className="form-login__row">
          <label htmlFor="password" className="form-login__label">Password</label>
          <input type="password" className="form-login__input" name="password" id="password"/>
        </div>
        <div className="form-login__row">
          <button className="button" type="button" onClick={handleLoginStaff}>
            Login
          </button>
        </div>
      </form>
    </>
  );
}

export default PageStaffLogin;
