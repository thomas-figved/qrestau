import { useEffect, useState } from 'react'
import { useCart } from 'contexts/CartContext';


function MenuItem(props) {
  const {cartItems, addToCart, removeFromCart, removeAll, getQuantity} = useCart();

  const [qty, setQty] = useState(getQuantity(props.item));

  useEffect(()=>{
    setQty(getQuantity(props.item))
  },[cartItems, getQuantity, props.item])

  const handleAddItem = function(e) {
    addToCart(props.item)
  }

  const handleRemoveItem = function(e) {
    removeFromCart(props.item)
  }

  const handleRemoveAll = function(e) {
    removeAll(props.item)
  }


  return (
    <div className="menu__item" data-item-id={props.item.id}>
      <div className="menu__col">
        {props.item.title}
      </div>
      <div className="menu__col menu__col--price">
        {props.item.price}
      </div>
      <div className="menu__col menu__col--qty">
        {qty}
      </div>
      <div className="menu__col menu__col--actions">

        {
          qty > 0 &&
          <>
            <button className="menu__button menu__button--danger" onClick={handleRemoveAll}>
              <i className="fa-solid fa-trash"></i>
            </button>
            <button className="menu__button" onClick={handleRemoveItem}>
              <i className="fa-solid fa-minus"></i>
            </button>
          </>
        }

        <button className="menu__button" onClick={handleAddItem}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  )
}

export default MenuItem;
