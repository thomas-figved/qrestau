import {React} from "react";
// import Tables from "components/staff/Tables"
import { NavLink } from "react-router-dom";

function PageHome() {
  return (
    <>
      <div className="">
        Home
      </div>

      <NavLink
        to="/staff"
        className={({ isActive, isPending }) =>
            isPending ? "nav__link nav__link--pending" : isActive ? "nav__link  nav__link--active" : "nav__link"
        }
      >
        For staff
      </NavLink>
    </>
  );
}

export default PageHome;
