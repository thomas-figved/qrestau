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
import ProtectedRoute from 'components/ProtectedRoute'



function App() {

  return (
    <>
      <Header/>
      <div className='page-wrap'>
        <Routes>
          <Route element={<PageHome/>} path="/"/>
          <Route element={<PageStaffLogin/>} path="/staff"/>
          <Route element = {<PageCustomerLogin/>} path="/customer/tables/:table_id"/>

          {/* need auth pages (either staff or customer) */}
          <Route element = {
            <ProtectedRoute forStaff={false}>
              <PageMenu/>
            </ProtectedRoute>
          } path="/customer/tables/:table_id/meals/:meal_id/menu"/>
          <Route element = {
            <ProtectedRoute forStaff={false}>
              <PageCart/>
            </ProtectedRoute>
          } path="/customer/tables/:table_id/meals/:meal_id/cart"/>
          <Route element = {
            <ProtectedRoute forStaff={false}>
              <PageOrderedItems/>
            </ProtectedRoute>
          } path="/customer/tables/:table_id/meals/:meal_id/order"/>

          {/* Staff only pages */}
          <Route element={
            <ProtectedRoute forStaff={true}>
              <PageStaffTableDetails/>
            </ProtectedRoute>
          } path="/staff/tables/:table_id"/>
          <Route element = {
            <ProtectedRoute forStaff={true}>
              <PageStaffDashboard/>
            </ProtectedRoute>
          } path="/staff/dashboard"/>
        </Routes>
      </div>
    </>
  );
}

export default App;
