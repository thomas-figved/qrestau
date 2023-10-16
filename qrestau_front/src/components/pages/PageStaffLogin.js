import {React} from "react";

import Login from "components/Login";

function PageStaffLogin() {
  return (
    <>
      <div className="page-wrap__title">
        <h1 className="title">Staff login</h1>
      </div>

      <Login forStaff={true}/>
    </>
  );
}

export default PageStaffLogin;
