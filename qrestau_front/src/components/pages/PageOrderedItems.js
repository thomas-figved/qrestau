import {React, useState, useEffect, useCallback} from "react";
import { useCookies } from 'react-cookie';
import { NavLink, useParams} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import MealItem from "components/MealItem";
import { useCart } from 'contexts/CartContext';


function PageOrderedItems() {
  const [cookies] = useCookies([['token', 'cart']]);
  const {backendURL} = useAPI();
  const {clearCart, getCartTotal, getCartItemAmount } = useCart();
  const { table_id, meal_id } = useParams();

  const [mealItems, setMealItems] = useState([]);
  const [total, setTotal] = useState(0);


  const fetch_meal_items = useCallback(function() {
    try {
      let axios_conf = {
        method: "get",
        url: `${backendURL}/api/meals/${meal_id}/meal-items`,
        headers: { Authorization: `Token ${cookies.token}` }
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
  },[setMealItems, cookies, backendURL, meal_id]);

  useEffect(()=>{
    fetch_meal_items();
  },[]);


  useEffect(()=>{
    console.log("setting total");

    setTotal(Math.round(mealItems.reduce((total, mealItem) => total + mealItem.price * mealItem.qty * 100, 0)) / 100);

    console.log("total is", total);

  },[mealItems]);

  return (
    <>
      {/* TODO check user group, only display for staff*/}
      <div className="page-wrap__back">
        <NavLink to={`/staff/tables/${table_id}`} className="button">
          Back
        </NavLink>
      </div>

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
