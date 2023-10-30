import React from "react";

import Login from "components/Login";


function PageCustomerLogin() {
  // eslint-disable-next-line

  return (
    <>
      <h1>QRestau</h1>

      <div>Please enter the password for your table to start ordering.</div>


      <Login forStaff={false}/>
    </>
  )
}

export default PageCustomerLogin;