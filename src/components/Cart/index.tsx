import emailjs from "@emailjs/browser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
import { CartItem, CheckoutItem } from "../../type";

const Cart: React.FC = observer(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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

        if (userData.cartItems) {
          setCartItems(userData.cartItems);
        }

        if (userData.checkoutItems) {
          setCheckoutItems(userData.checkoutItems || []);
        }
      }
    });

    return () => unsubscribe();
  }, [appStore.currentUserEmail]);

  const changeItemQuantity = async (
    itemIndex: number,
    quantityChange: number,
  ) => {
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
      toast.success("已刪除商品");
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
        setShowConfirmModal(true);
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
      } catch (error) {
        console.error("訂單處理失敗", error);
        toast.error("訂單處理失敗");
      }
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
  };
  const [activeTab, setActiveTab] = useState("cart");

  const handleTabChange = (tabKey: any) => {
    setActiveTab(tabKey);
  };
  return (
    <div className="mt-4">
      <div className="flex justify-center ">
        <button
          className={` px-2 py-2 ${
            activeTab === "cart"
              ? "tab-border-left h-auto w-auto bg-yellow text-white"
              : "tab-border-left border-1 border-yellow"
          }`}
          onClick={() => handleTabChange("cart")}
        >
          <p className="leading-none">購物車</p>
        </button>
        <button
          className={` px-2 py-2 ${
            activeTab === "checkout"
              ? "tab-border-right h-auto w-auto bg-yellow  text-white"
              : "tab-border-right border-1 border-yellow"
          }`}
          onClick={() => handleTabChange("checkout")}
        >
          <p className="leading-none">已結帳</p>
        </button>
      </div>
      {activeTab === "checkout" && (
        <div>
          {checkoutItems.length > 0 ? (
            <div>
              {checkoutItems.map((item, index) => (
                <div
                  key={index}
                  className="mx-auto my-6 grid justify-center rounded-md border bg-white p-2 px-[20px] align-middle leading-none sm:w-2/3 md:w-1/4 xl:flex xl:w-1/2 xl:justify-between"
                >
                  <p className="whitespace-nowrap border-b-2 py-2 xl:border-none">
                    {item.name}
                  </p>
                  <p className="whitespace-nowrap py-2">
                    數量: {item.quantity}
                  </p>
                  <p className="whitespace-nowrap py-2">
                    價格: NT${item.price}元
                  </p>
                  <p className="whitespace-nowrap py-2">
                    小計: NT${item.price * item.quantity}元
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center ">
              <div className="my-6 w-4/5 rounded-md border p-4 text-center lg:w-1/2">
                <h1 className="mb-4 items-center whitespace-nowrap text-xl">
                  尚未購買任何票券
                </h1>
                <GlobalButton variant="gray" content="回首頁逛逛" to="/" />
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === "cart" && (
        <div>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="relative mx-auto my-6 grid w-2/3 items-center justify-center  rounded-md border bg-white p-2 px-[20px]  xl:relative xl:flex xl:w-2/3 xl:justify-between"
                >
                  <p className="whitespace-nowrap border-b-2 py-2 pb-2 xl:border-none xl:pb-0">
                    {item.name}
                  </p>

                  <div className="flex items-center gap-4 pt-2 xl:pt-0">
                    <p className="whitespace-nowrap py-2">數量:</p>
                    <button
                      onClick={() => {
                        changeItemQuantity(index, -1);
                      }}
                      className=" flex h-4 w-4 items-center justify-center rounded-full bg-stone-700 py-2"
                    >
                      <p className="text-base text-white">-</p>
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      onClick={() => {
                        changeItemQuantity(index, +1);
                      }}
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-700 py-2"
                    >
                      <p className="text-base text-white">+</p>
                    </button>
                  </div>
                  <p className=" py-2">價格: NT${item.price}元</p>
                  <p className=" py-2">
                    小計: NT${item.price * item.quantity}元
                  </p>
                  <button onClick={() => deleteItem(index)}>
                    <div className=" mx-auto h-12 w-12 cursor-pointer bg-[url('/trash.png')] bg-contain md:right-0 md:top-0" />
                  </button>
                </div>
              ))}
              <div className="flex justify-center">
                <div className=" text-center">
                  <p className="mt-4">總金額：NT$ {subtotal} 元</p>
                  <div className="mt-8">
                    <GlobalButton
                      variant="brown"
                      content="確認付款"
                      onClick={handleCheckOut}
                    />
                  </div>
                </div>
              </div>
              {showConfirmModal && (
                <>
                  <div className="fixed left-1/2 top-1/2 z-40 grid h-[300px] w-4/5 -translate-x-1/2 -translate-y-1/2 transform place-content-center gap-6 rounded-lg border border-b-[20px] border-brown bg-white p-4 shadow-lg md:w-1/4">
                    <div className=" flex justify-center">
                      <div>
                        <p className="mb-3">已送出訂單資訊至您的E-mail!</p>
                        <p>重整畫面即可查看地圖中足跡</p>
                      </div>
                    </div>
                    <div className=" flex justify-center gap-4">
                      <GlobalButton
                        variant="green"
                        content="確定"
                        onClick={handleConfirm}
                      />
                    </div>
                  </div>
                  <div className="background-cover"></div>
                </>
              )}
            </>
          ) : (
            <div className="flex justify-center ">
              <div className="my-6 w-4/5 rounded-md border p-4 text-center lg:w-1/2">
                <h1 className="mb-4 items-center whitespace-nowrap text-xl">
                  目前購物車為空
                </h1>
                <GlobalButton variant="gray" content="回首頁逛逛" to="/" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default Cart;
