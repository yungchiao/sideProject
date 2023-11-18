import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";
const Cart: React.FC = observer(() => {
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      appStore.setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(appStore.getCart()));
  }, [appStore.getCart()]);

  const cartItems = appStore.getCart();

  return (
    <div>
      {cartItems.map((item, index) => (
        <div key={index}>
          <p>{item.name}</p>
          <p>數量: {item.quantity}</p>
          <p>價格: NT${item.price}元</p>
        </div>
      ))}
    </div>
  );
});

export default Cart;
