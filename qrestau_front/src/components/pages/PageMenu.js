import {React, useState, useEffect, useCallback} from "react";
import { NavLink, useParams} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';
import {useAuth} from 'contexts/AuthContext';
import MenuItem from "components/MenuItem";
import { useCart } from 'contexts/CartContext';


function PageMenu() {
  const {fetchData} = useAPI();
  const {isStaff} = useAuth();

  const {clearCart, getCartTotal, getCartItemAmount } = useCart();
  const { meal_id, table_id } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([])
  const [categories, setCategories] = useState([]);
  const [activeCategoryID, setActiveCategoryID] = useState(0);


  const fetchMenuItems = useCallback(() => {

    const menuSuccessCallback = (response) => {
      setMenuItems(response.data);
    }

    fetchData({
      path: `/api/items`,
      method: 'get',
      needsAuth: true,
      successCallback: menuSuccessCallback,
    })
  },[fetchData])


  const fetchCategories = useCallback (() => {

    const categoriesSuccessCallback = (response) => {
      setCategories(response.data);
      setActiveCategoryID(response.data[0].id);
    }

    fetchData({
      path: `/api/categories`,
      method: 'get',
      needsAuth: true,
      successCallback: categoriesSuccessCallback,
    })
  }, [fetchData])

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [])

  const filterItems = useCallback(function(category_id) {
    category_id = parseInt(category_id);
    let filteredMenu = menuItems.filter(function(menuitem){
      return menuitem.category.id === category_id;
    });
    setFilteredMenuItems(filteredMenu);
    setActiveCategoryID(category_id);
  },[menuItems])


  useEffect(() => {
    filterItems(activeCategoryID);
  },[activeCategoryID, filterItems])


  const handleFilterMenuItems = function(e) {
    filterItems(e.target.dataset.catId);
  }


  return (
    <>
      { isStaff ? 
        <div className="page-wrap__back">
          <NavLink to={`/staff/tables/${table_id}`} className="button">
            Back
          </NavLink>
        </div>
      :
        <NavLink to={`/customer/tables/${table_id}/meals/${meal_id}/order`} className="button">
          Ordered items
        </NavLink>
      }

      <div className="page-wrap__category">
        { categories.map((category, key) => {
          return (
            <button
            className={activeCategoryID ===  category.id ? "category category--active" : "category"}
            key={category.id}
            data-cat-id={category.id}
            onClick={handleFilterMenuItems}>
              {category.title}
            </button>
          )
        })}
      </div>

      <ul className="page-wrap__menu-item">
        { filteredMenuItems.map((item, key) => {
          return (
            <MenuItem key={item.id} item={item}/>
          )
        })}
      </ul>


      {
        getCartItemAmount() > 0 ? 

        <div className="page-wrap__cart-summary">
          items in cart = {getCartItemAmount()} <br/>
          cart total = {getCartTotal()} <br/>

          <button className="button" onClick={clearCart}>
            Empty cart
          </button>

          <NavLink to={`/customer/tables/${table_id}/meals/${meal_id}/cart`} className="button">
            Review cart
          </NavLink>
        </div>
        :""
      }

    </>
  );
}

export default PageMenu;
