import emailjs from "@emailjs/browser";
import { Button } from "@nextui-org/react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
interface CartItem {
  name: string;
  quantity: number;
  price: number;
  id: string;
}
interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}

const Cart: React.FC = observer(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

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
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (appStore.currentUserEmail) {
        const userRef = doc(appStore.db, "user", appStore.currentUserEmail);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.checkout) {
              setCheckoutItems(userData.checkout);
            }
          }
        } catch (error) {
          console.error("讀取訂單資料失敗", error);
        }
      }
    };

    fetchCheckoutData();
  }, [appStore.currentUserEmail]);

  useEffect(() => {
    if (!appStore.currentUserEmail) return;

    const userRef = doc(appStore.db, "user", appStore.currentUserEmail);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        if (userData.checkout && userData.checkout.length > 0) {
          setHasCheckedOut(true);
        } else {
          setHasCheckedOut(false);
        }
      }
    });

    return () => unsubscribe();
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
  const SERVED_ID = "service_um0snro";
  const TEMPLETE_ID = "template_7jpstzp";
  const PUBLIC_KEY = "KGd5mgGXtzBQFKCyN";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const formatCartItemsForEmail = () => {
    return cartItems
      .map((item) => `${item.name} x ${item.quantity} - NT$${item.price}元`)
      .join("\n");
  };

  const handleCheckOut = async () => {
    if (appStore.newUser && appStore.currentUserEmail) {
      try {
        const formattedCartItems = formatCartItemsForEmail();
        await appStore.addCheckoutItem(appStore.currentUserEmail, cartItems);
        await emailjs.send(
          SERVED_ID,
          TEMPLETE_ID,
          {
            from_name: "Gravity Team 地新引力",
            to_name: appStore.newUser.name,
            from_email: form.email,
            to_email: appStore.newUser.email,
            message: `歡迎加入地新引力的世界，一起幫助逐漸消逝的傳統文化與精神再度復活，讓我們一起征服宇宙吧！\n\n您的訂單如下:\n${formattedCartItems}\n\n總金額：NT$ ${subtotal} 元`,
            test: "Gravity Team 地新引力",
          },
          PUBLIC_KEY,
        );

        const userRef = doc(appStore.db, "user", appStore.currentUserEmail);
        await updateDoc(userRef, {
          cartItems: [],
        });

        alert("已送出訂單！");
      } catch (error) {
        console.error("訂單處理失敗", error);
        alert("訂單處理失敗");
      }
    } else {
      console.log("無法發送電子郵件，因為用戶資料不完整。");
    }
  };

  return (
    <div className="mt-4 ">
      {checkoutItems.length > 0 && (
        <div className="border-b-2 pb-4">
          <h2 className="mb-4 flex justify-center p-4 text-xl font-bold">
            已結帳的商品
          </h2>
          {checkoutItems.map((item, index) => (
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
            </div>
          ))}
        </div>
      )}
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="mx-auto my-4 flex  w-3/4 justify-between rounded-md border bg-white p-2 align-middle leading-none"
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
                <p className="text-white" onClick={handleCheckOut}>
                  確認付款
                </p>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="mx-40  my-6  justify-center rounded-md border p-4 text-center">
          <h1 className="mb-4  items-center text-xl">目前購物車為空!</h1>
          <Button>
            <Link to="/">回首頁逛逛</Link>
          </Button>
        </div>
      )}
    </div>
  );
});

export default Cart;
