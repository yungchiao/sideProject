import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
interface CartItem {
  name: string;
  quantity: number;
  price: number;
  id: string;
}
const Cart: React.FC = observer(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const fetchCartData = async () => {
      const userId = appStore.currentUserEmail;
      if (userId) {
        const cartData = await appStore.fetchCart(userId);
        setCartItems(cartData);
      }
    };

    fetchCartData();
  }, [appStore.currentUserEmail]);
  const changeItemQuantity = async (itemIndex: any, quantityChange: any) => {
    const item = cartItems[itemIndex];
    const newQuantity = item.quantity + quantityChange;

    if (newQuantity >= 1) {
      setCartItems((currentItems) =>
        currentItems.map((ci, index) =>
          index === itemIndex ? { ...ci, quantity: newQuantity } : ci,
        ),
      );

      const userId = appStore.currentUserEmail;
      if (userId) {
        await appStore.updateCartItemQuantity(userId, item.id, newQuantity);
      }
    }
  };

  function deleteItem(itemIndex: any) {
    const itemToDelete = cartItems[itemIndex];

    if (itemToDelete && appStore.currentUserEmail) {
      const newCartItems = cartItems.filter((_, index) => index !== itemIndex);
      setCartItems(newCartItems);

      appStore.deleteFromCart(appStore.currentUserEmail, itemToDelete.id);
      window.alert("已刪除商品");
    }
  }
  const subtotal = cartItems.reduce(
    (prev, item) => prev + item.price * item.quantity,
    0,
  );

  return (
    <div className="mt-4 ">
      {cartItems.map((item, index) => (
        <div
          key={index}
          className="mx-auto mb-4 flex  w-3/4 justify-between rounded-md border bg-white p-2 align-middle leading-none"
        >
          <p className=" py-2">{item.name}</p>
          <p className=" py-2">數量:</p>
          <button
            onClick={() => {
              changeItemQuantity(index, -1);
            }}
            className=" py-2"
          >
            -
          </button>
          <p className=" py-2">{item.quantity}</p>
          <button
            onClick={() => {
              changeItemQuantity(index, +1);
            }}
          >
            +
          </button>
          <p className=" py-2">價格: NT${item.price}元</p>
          <p className=" py-2">小計: NT${item.price * item.quantity}元</p>
          <button onClick={() => deleteItem(index)}>
            <div className="h-8 w-8 cursor-pointer bg-[url('/trash.png')] bg-contain" />
          </button>
        </div>
      ))}
      <div className="flex justify-center">
        <div className=" text-center">
          <p className="mt-4">總金額：NT$ {subtotal} 元</p>
          <Button className="mt-8 bg-stone-700">
            <p className="text-white">確認付款</p>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Cart;
