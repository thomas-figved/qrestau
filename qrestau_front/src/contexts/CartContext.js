// CREDIT TO https://dev.to/anne46/cart-functionality-in-react-with-context-api-2k2f

import { createContext, useState, useEffect, useContext } from 'react'

const CartContext = createContext()

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [])

  const addToCart = async (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = async (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart) {
      if (isItemInCart.qty === 1) {
        setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
      } else {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, qty: cartItem.qty - 1 }
              : cartItem
          )
        );
      }
    }
  };

  const getQuantity = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart) {
      return isItemInCart.qty;
    } else {
      return 0;
    }
  };

  //remove all occurence of the item in the cart
  const removeAll = async (item) => {
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemAmount = () => {
    return cartItems.reduce((total_qty, item) => total_qty + item.qty, 0);
  };


  const getCartTotal = () => {
    return Math.round(cartItems.reduce((total, item) => total + item.price * item.qty * 100, 0)) / 100;
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeAll,
        getQuantity,
        clearCart,
        getCartItemAmount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;


// Create a hook to use the CartContext, this is a Kent C. Dodds pattern
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
}