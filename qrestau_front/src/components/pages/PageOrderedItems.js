import {React, useState, useEffect, useCallback} from "react";
import { NavLink, useParams} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';
import {useAuth} from 'contexts/AuthContext';

import MealItem from "components/MealItem";


function PageOrderedItems() {
  const {fetchData} = useAPI();
  const {isStaff} = useAuth();

  const { table_id, meal_id } = useParams();

  const [mealItems, setMealItems] = useState([]);
  const [total, setTotal] = useState(0);


  const fetchMealItems = useCallback(function() {

    const successCallback = (response) => {
      setMealItems(response.data);
    }

    fetchData({
      path: `/api/meals/${meal_id}/meal-items`,
      method: "get",
      needsAuth: true,
      successCallback: successCallback,
    })

  },[fetchData, meal_id]);

  useEffect(()=>{
    fetchMealItems();
  },[fetchMealItems]);


  useEffect(()=>{
    setTotal(Math.round(mealItems.reduce((total, mealItem) => total + mealItem.price * mealItem.qty * 100, 0)) / 100);
  },[mealItems]);

  return (
    <>
      {
        isStaff ? 
          <div className="page-wrap__back">
            <NavLink to={`/staff/tables/${table_id}`} className="button">
              Back
            </NavLink>
          </div>
        :
          <div className="page-wrap__back">
            <NavLink to={`/customer/tables/${table_id}/meals/${meal_id}/menu`} className="button">
              Back
            </NavLink>
          </div>
      }

      <ul className="page-wrap__menu-item">
        { mealItems.map((mealItem, key) => {
          return (
            <MealItem key={mealItem.id} mealItem={mealItem} fetch_meal_items={fetchMealItems}/>
          )
        })}
      </ul>

      <div className="page-wrap__total">
        Total: {total}
      </div>
    </>
  );
}

export default PageOrderedItems;
