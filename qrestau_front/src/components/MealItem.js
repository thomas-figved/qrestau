import { useEffect, useState, useRef } from 'react'
import { useCookies } from 'react-cookie';
import { useParams} from "react-router-dom";

import axios from 'axios';
import {useAPI} from 'contexts/APIContext';


function MenuItem(props) {
  const [cookies] = useCookies([['token', 'cart']]);
  const {backendURL, isStaff} = useAPI();
  const { meal_id } = useParams();

  const [qty, setQty] = useState(props.mealItem.qty)
  const [isDelivered, setIsDelivered] = useState(props.mealItem.is_delivered)

  const cancelMealItem = function() {
    try {
      let axios_conf = {
        method: "delete",
        url: `${backendURL}/api/meals/${meal_id}/meal-items/${props.mealItem.id}`,
        headers: { Authorization: `Token ${cookies.token}` }
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        props.fetch_meal_items()
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isFirstRender = useRef(true)

  useEffect(function() {
    if (isFirstRender.current) {
      isFirstRender.current = false // toggle flag after first render/mounting
      return;
    }

    try {
      let payload = {
        'qty': qty,
        'is_delivered': isDelivered,
      }

      let axios_conf = {
        method: "patch",
        url: `${backendURL}/api/meals/${meal_id}/meal-items/${props.mealItem.id}`,
        headers: { Authorization: `Token ${cookies.token}` },
        data: payload,
      };

      let axios_instance = axios.create();

      axios_instance.request(axios_conf)
      .then(function (response) {
        props.fetch_meal_items()
      })
      .catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  },[qty, isDelivered]);


  const handleCancelMealItem = function(e) {
    cancelMealItem();
  }


  const handleRemoveItem = function(e) {
    if(qty === 1) {
      cancelMealItem();
    } else {
      setQty(qty -1);
    }
  }

  const handleAddItem = function(e) {
    setQty(qty + 1);
  }

  const handleSetDelivered = function(e) {
    setIsDelivered(true)
  }

  return (
    <li className="menu-item" data-item-id={props.mealItem.id}>
      <div className="menu-item__title">
        {props.mealItem.item.title}
      </div>

      <div className="menu-iten__price">
        {props.mealItem.price}
      </div>

      <div className="menu-iten__price">
        {isDelivered ? "delivered" : "pending"}
      </div>

      { !isDelivered && isStaff ? //TODO check if user is staff
        <>
          <button className="menu-item__remove-all" onClick={handleCancelMealItem}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          <button className="menu-item__remove" onClick={handleRemoveItem}>
            <i className="fa-solid fa-minus"></i>
          </button>

          <div className="menu-iten__qty">
            {qty}
          </div>

          <button className="menu-item__add" onClick={handleAddItem}>
            <i className="fa-solid fa-plus"></i>
          </button>

          <button className="menu-item__delivered" onClick={handleSetDelivered}>
            Set delivered
          </button>
        </>

      :

        <div className="menu-iten__qty">
          {qty}
        </div>
      }
    </li>
  )
}

export default MenuItem;
