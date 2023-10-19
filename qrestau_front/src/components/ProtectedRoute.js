import { useNavigate, useLocation, useParams } from 'react-router-dom';

import {useAuth} from 'contexts/AuthContext'

import { useEffect } from 'react';

function ProtectedRoute({forStaff, children }) {
  const { isAuthenticated, isStaff, authorizedTableId, authorizedMealId, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { table_id, meal_id } = useParams();

  useEffect(()=>{
    const isMealAuthorized = meal_id === null || authorizedMealId === parseInt(meal_id)
    const isTableAuthorized = table_id === null || authorizedTableId === parseInt(table_id)

    if(isLoading !== null && isLoading === false) {
      if (!isAuthenticated) {
        navigate('/',{
          replace: true,
          state: {
            from: location
          },
        })

      } else {
        if(forStaff && !isStaff){
          navigate(`/customer/tables/${authorizedTableId}/meals/${authorizedMealId}/menu`,{
            replace: true,
            state: {
              from: location
            },
          })
        } else if((!isStaff && !isMealAuthorized) || (!isStaff && !isTableAuthorized)) {
          //We redirect to the customer menu page
          navigate(`/customer/tables/${authorizedTableId}/meals/${authorizedMealId}/menu`,{
            replace: true,
            state: {
              from: location
            },
          })
        }
      }
    }
    
  },[isLoading, isStaff, forStaff, isAuthenticated, authorizedTableId, authorizedMealId, location, navigate, meal_id, table_id])

  

  return children;
};

export default ProtectedRoute;
