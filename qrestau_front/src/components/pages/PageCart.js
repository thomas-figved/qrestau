import {React} from "react";
import { NavLink, useParams, useNavigate} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';

import MenuItem from "components/MenuItem";
import { useCart } from 'contexts/CartContext';


function PageCart() {
  const {cartItems, clearCart, getCartTotal, getCartItemAmount } = useCart();
  const { meal_id, table_id } = useParams();
  const navigate = useNavigate();

  const {fetchData} = useAPI();


  const handleOrderMenuItems = function(e) {

    let payload = [];
    for(let cartItem of cartItems) {
      payload.push({
        item_id: cartItem.id,
        qty:  cartItem.qty,
      });
    }

    const successCallback = () => {
      clearCart();
      navigate(`/customer/tables/${table_id}/meals/${meal_id}/menu`);
    }

    fetchData({
      path: `/api/meals/${meal_id}/meal-items`,
      method: `post`,
      payload: payload,
      needsAuth: true,
      successCallback: successCallback,
    })
  }


  return (
    <>
      <div className="page-wrap__back">
        <NavLink to={`/customer/tables/${table_id}/meals/${meal_id}/menu`} className="button">
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
