import {React, useState, useEffect, useCallback} from "react";
import { useCookies } from 'react-cookie';
import { NavLink, useParams} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';
import MenuItem from "components/MenuItem";
import { useCart } from 'contexts/CartContext';


function PageMenu() {
  const [cookies] = useCookies([['token', 'cart']]);
  const {backendURL} = useAPI();
  const {clearCart, getCartTotal, getCartItemAmount } = useCart();
  const { meal_id } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([])
  const [categories, setCategories] = useState([]);
  const [activeCategoryID, setActiveCategoryID] = useState(0);


  const fetchMenuItems = useCallback (async function() {
    try {
      let axios_conf = {
        method: "get",
        url: backendURL + "/api/items",
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        setMenuItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[backendURL, cookies]);

  const fetchCategories = useCallback(async function() {
    try {
      let axios_conf = {
        method: "get",
        url: backendURL + "/api/categories",
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        setCategories(response.data);
        setActiveCategoryID(response.data[0].id);
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[backendURL, cookies]);


  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [fetchMenuItems,fetchCategories])

  const filterItems = function(category_id) {
    category_id = parseInt(category_id);
    let filteredMenu = menuItems.filter(function(menuitem){
      return menuitem.category.id === category_id;
    });
    setFilteredMenuItems(filteredMenu);
    setActiveCategoryID(category_id);
  }


  useEffect(() => {
    filterItems(activeCategoryID);
  },[activeCategoryID, menuItems])


  const handleFilterMenuItems = function(e) {
    filterItems(e.target.dataset.catId);
  }


  return (
    <>
      {/* TODO check user group, only display for staff*/}
      <div className="page-wrap__back">
        <NavLink to={`/staff/dashboard`} className="button">
          Back
        </NavLink>
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

          <NavLink to={`/customer/${meal_id}/cart`} className="button">
            Review cart
          </NavLink>
        </div>
        :""
      }

    </>
  );
}

export default PageMenu;
