import {React} from "react";
// import Tables from "components/staff/Tables"
import { NavLink } from "react-router-dom";

function PageHome() {
  return (
    <>
      <div className="page-wrap__home">
        <div className="home">
          <h1 className="home__title">
            QR Restau
          </h1>
          <p className="home__intro">
            Please scan the QR Code on your table to start ordering
          </p>

          <div className="home__button">
            <NavLink
              to="/staff"
              className="button"
            >
              Staff Access
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default PageHome;
