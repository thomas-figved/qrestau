import  'styles/main.scss';

import {React} from "react";
import {Route, Routes } from "react-router-dom";

import PageHome from 'components/pages/PageHome'
import PageStaffLogin from 'components/pages/PageStaffLogin'
import PageStaffDashboard from 'components/pages/PageStaffDashboard'
import PageStaffTableDetails from 'components/pages/PageStaffTableDetails'
import PageCustomerLogin from 'components/pages/PageCustomerLogin'
import PageMenu from 'components/pages/PageMenu'
import PageCart from 'components/pages/PageCart'
import PageOrderedItems from 'components/pages/PageOrderedItems'

// import {useAuth} from 'contexts/AuthContext';

import Header from 'components/Header';



function App() {
  // eslint-disable-next-line

  return (
    <>
      <Header/>
      <div className='page-wrap'>
        <Routes>
          <Route element={<PageHome/>} path="/"/>
          <Route element={<PageStaffLogin/>} path="/staff"/>
          <Route element={<PageStaffTableDetails/>} path="/staff/tables/:table_id"/>
          <Route element = {<PageStaffDashboard/>} path="/staff/dashboard"/>
          <Route element = {<PageCustomerLogin/>} path="/customer/tables/:table_id"/>
          <Route element = {<PageMenu/>} path="/customer/tables/:table_id/meals/:meal_id/menu"/>
          <Route element = {<PageCart/>} path="/customer/tables/:table_id/meals/:meal_id/cart"/>
          <Route element = {<PageOrderedItems/>} path="/customer/tables/:table_id/meals/:meal_id/order"/>
        </Routes>
      </div>
    </>
  );
}

export default App;
