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

      <div className="page-wrap__title">
        <h1 className="title">
          Review cart
        </h1>
      </div>

      <div className="page-wrap__menu">
        <div className="menu">
          <div className="menu__header">
            <div className="menu__col">
              Product
            </div>
            <div className="menu__col menu__col--price">
              Price
            </div>
            <div className="menu__col menu__col--qty">
              Qty
            </div>
            <div className="menu__col menu__col--actions">
            </div>
          </div>
          { cartItems.map((item, key) => {
            return (
              <MenuItem key={item.id} item={item}/>
            )
          })}
        </div>
      </div>

      <div className="page-wrap__action-bar">
        <div className="action-bar">
          <button className="button button--error" onClick={clearCart}>
            <i className="fa-solid fa-trash"></i>
          </button>

          <div className="action-bar__total">
            Total: {getCartTotal()}
          </div>

          <button className="button" onClick={handleOrderMenuItems}>
            Order
            <div className="button__cart-count">
                {getCartItemAmount()}
              </div>
          </button>
        </div>
      </div>
    </>
  );
}

export default PageCart;
