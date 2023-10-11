import {React, useState, useEffect, useCallback} from "react";
import { useCookies } from 'react-cookie';
import { NavLink, useParams, useNavigate} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import MenuItem from "components/MenuItem";
import { useCart } from 'contexts/CartContext';


function PageCart() {
  const [cookies] = useCookies([['token', 'cart']]);
  const {backendURL} = useAPI();
  const {cartItems, clearCart, getCartTotal, getCartItemAmount } = useCart();
  const { meal_id } = useParams();
  const navigate = useNavigate();


  const handleOrderMenuItems = function(e) {

    let payload = [];
    for(let cartItem of cartItems) {
      payload.push({
        item_id: cartItem.id,
        qty:  cartItem.qty,
      });
    }

    try {
      let axios_conf = {
        method: "post",
        url: `${backendURL}/api/meals/${meal_id}/meal-items`,
        headers: { Authorization: `Token ${cookies.token}` },
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        clearCart();
        navigate(`/customer/${meal_id}/menu`);
      })
      .catch((error) => {

      });
    } catch (error) {
    }
  }


  return (
    <>
      <div className="page-wrap__back">
        <NavLink to={`/customer/${meal_id}/menu`} className="button">
          Back
        </NavLink>
      </div>

      <ul className="page-wrap__menu-item">
        { cartItems.map((item, key) => {
          return (
            <MenuItem key={item.id} item={item}/>
          )
        })}
      </ul>

      <div className="page-wrap__cart-summary">
          items in cart = {getCartItemAmount()} <br/>
          cart total = {getCartTotal()} <br/>

          <button className="button" onClick={clearCart}>
            Delete cart
          </button>

          <button className="button" onClick={handleOrderMenuItems}>
            Order
          </button>
      </div>
    </>
  );
}

export default PageCart;
