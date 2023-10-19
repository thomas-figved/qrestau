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

      <div className="page-wrap__title">
        <h1 className="title">
          Menu
        </h1>
      </div>

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
          { filteredMenuItems.map((item, key) => {
            return (
              <MenuItem key={item.id} item={item}/>
            )
          })}
        </div>
      </div>
      {
        getCartItemAmount() > 0 &&

        <>
        <div className="page-wrap__action-bar">
          <div className="action-bar">
            <button className="button button--error" onClick={clearCart}>
              <i className="fa-solid fa-trash"></i>
            </button>

            <div className="action-bar__total">
              Total: {getCartTotal()}
            </div>

            <NavLink to={`/customer/tables/${table_id}/meals/${meal_id}/cart`} className="button">
              <i className="fa-solid fa-cart-shopping"></i>
              <div className="button__cart-count">
                {getCartItemAmount()}
              </div>
            </NavLink>
          </div>
        </div>
        </>
      }

    </>
  );
}

export default PageMenu;
