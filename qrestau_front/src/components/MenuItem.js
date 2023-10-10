import { useCookies } from 'react-cookie';


function MenuItem(props) {
  const [cookies, setCookie] = useCookies([['token', 'cart']]);

  const handleAddItem = function(e) {

  }


  return (
    <li className="menu-item" data-item-id={props.id}>
      <div className="menu-item__title">
        {props.title}
      </div>

      <div className="menu-iten__price">
        {props.price}
      </div>

      <button className="menu-item__remove">
        <i className="fa-solid fa-minus"></i>
      </button>

      <div className="menu-item__count">
        0
      </div>

      <button className="menu-item__add">
        <i className="fa-solid fa-plus"></i>
      </button>
    </li>
  )
}

export default MenuItem;
