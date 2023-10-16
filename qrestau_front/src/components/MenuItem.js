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
    <li className="menu-item" data-item-id={props.item.id}>
      <div className="menu-item__title">
        {props.item.title}
      </div>

      <div className="menu-iten__price">
        {props.item.price}
      </div>

      <button className="menu-item__remove-all" onClick={handleRemoveAll}>
        <i className="fa-solid fa-xmark"></i>
      </button>


      <button className="menu-item__remove" onClick={handleRemoveItem}>
        <i className="fa-solid fa-minus"></i>
      </button>

      <div className="menu-item__qty">
        {qty}
      </div>

      <button className="menu-item__add" onClick={handleAddItem}>
        <i className="fa-solid fa-plus"></i>
      </button>
    </li>
  )
}

export default MenuItem;
