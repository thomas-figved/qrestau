import {React, useState, useEffect, useCallback} from "react";
import { NavLink, useParams} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import MealItem from "components/MealItem";


function PageOrderedItems() {
  const {backendURL, isStaff, getAuthorizationHeader} = useAPI();
  const { table_id, meal_id } = useParams();

  const [mealItems, setMealItems] = useState([]);
  const [total, setTotal] = useState(0);


  const fetch_meal_items = useCallback(function() {
    try {
      let axios_conf = {
        method: "get",
        url: `${backendURL}/api/meals/${meal_id}/meal-items`,
        headers: getAuthorizationHeader()
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        console.log("fetching");
        setMealItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[setMealItems, getAuthorizationHeader, backendURL, meal_id]);

  useEffect(()=>{
    fetch_meal_items();
  },[fetch_meal_items]);


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
            <MealItem key={mealItem.id} mealItem={mealItem} fetch_meal_items={fetch_meal_items}/>
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
