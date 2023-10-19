import { useCallback } from 'react'
import { useParams} from "react-router-dom";

import {useAPI} from 'contexts/APIContext';
import {useAuth} from 'contexts/AuthContext';


function MealItem(props) {
  const {fetchData} = useAPI()
  const {isStaff} = useAuth()
  const { meal_id } = useParams()

  const cancelMealItem = useCallback(()=>{

    const successCallback = () => {
      props.fetch_meal_items()
    }

    fetchData({
      path: `/api/meals/${meal_id}/meal-items/${props.mealItem.id}`,
      method: "delete",
      needsAuth: true,
      successCallback: successCallback,
    })

  },[fetchData, meal_id, props])

  const updateItem = useCallback((qty, isDelivered) => {

    let payload = {
      'qty': qty,
      'is_delivered': isDelivered,
    }

    const successCallback = () => {
      props.fetch_meal_items()
    }

    fetchData({
      path: `/api/meals/${meal_id}/meal-items/${props.mealItem.id}`,
      method: "patch",
      payload: payload,
      needsAuth: true,
      successCallback: successCallback,
    })
  },[fetchData, meal_id, props])


  // const handleCancelMealItem = function(e) {
  //   cancelMealItem();
  // }

  const handleRemoveItem = function(e) {
    if(props.mealItem.qty === 1) {
      cancelMealItem();
    } else {
      updateItem(props.mealItem.qty - 1, props.mealItem.is_delivered)
    }
  }

  const handleAddItem = function(e) {
    updateItem(props.mealItem.qty + 1, props.mealItem.is_delivered)
  }

  const handleSetDelivered = function(e) {
    updateItem(props.mealItem.qty, true)

  }

  return (


    <div className="menu__item" data-item-id={props.mealItem.id}>
      <div className="menu__col">
        {props.mealItem.item.title}
      </div>
      <div className="menu__col menu__col--price">
        {props.mealItem.price}
      </div>
      <div className="menu__col menu__col--qty">
        {props.mealItem.qty}
      </div>
      <div className="menu__col menu__col--status">
        {props.mealItem.is_delivered ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-hourglass"></i>}
      </div>

      {
        !props.mealItem.is_delivered && isStaff  &&

        <div className="menu__col menu__col--actions">
          {/* <button className="menu__button menu__button--danger" onClick={handleCancelMealItem}>
            <i className="fa-solid fa-trash"></i>
          </button> */}

          <button className="menu__button" onClick={handleRemoveItem}>
            <i className="fa-solid fa-minus"></i>
          </button>

          <button className="menu__button" onClick={handleAddItem}>
            <i className="fa-solid fa-plus"></i>
          </button>

          <button className="menu__button" onClick={handleSetDelivered}>
            <i className="fa-solid fa-check"></i>
          </button>
        </div>
      }
    </div>
  )
}

export default MealItem;
