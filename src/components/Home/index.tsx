import "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";

const Home: React.FC = observer(() => {
  interface Admin {
    id: string;
    name: string;
    position: string;
    price: number;
    images: string;
    hashtags: [];
    startTime: Timestamp;
    endTime: Timestamp;
    content: string;
  }
  interface CartItem {
    name: string;
    quantity: number;
    price: number;
    id: string;
  }
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);
  const toggleDetail = () => {
    setDetailOpen(!isDetailOpen);
  };
  const handleAdminClick = (admin: any) => {
    setSelectedAdmin(admin);

    toggleDetail();
  };
  useEffect(() => {
    appStore.fetchAdmin();
  }, []);
  const handleSignUp = () => {
    if (selectedAdmin && quantity > 0) {
      const cartItem: CartItem = {
        name: selectedAdmin.name,
        quantity: quantity,
        price: selectedAdmin.price,
        id: selectedAdmin.id,
      };

      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.addToCart(userEmail, cartItem);
        alert("加入訂單成功！");
      } else {
        alert("用戶未登入");
      }
    } else {
      alert("請選擇數量");
    }
  };

  return (
    <div className="mt-28">
      {appStore.admins.map((admin: Admin) => (
        <div
          key={admin.id}
          className="mx-auto mt-4 w-3/4 cursor-pointer rounded-lg border p-4"
          onClick={() => handleAdminClick(admin)}
        >
          <h3>{admin.name}</h3>
          <p>
            {admin.startTime?.toDate()?.toLocaleString()}-
            {admin.endTime?.toDate()?.toLocaleString()}
          </p>
          <p>{admin.position}</p>
          <p>活動費用：NT${admin.price}</p>
          <img src={admin.images} className="h-auto w-60" />

          {admin.hashtags &&
            Array.isArray(admin.hashtags) &&
            admin.hashtags.map((hashtag: string, index: number) => (
              <p key={index}>#{hashtag}</p>
            ))}
          <p>{admin.content}</p>
        </div>
      ))}
      {isDetailOpen && selectedAdmin && (
        <div className="detail-container  border">
          <h3>{selectedAdmin.name}</h3>
          <p>{selectedAdmin.startTime?.toDate()?.toLocaleString()}</p>
          <p>{selectedAdmin.endTime?.toDate()?.toLocaleString()}</p>
          <p>{selectedAdmin.position}</p>
          <p>{selectedAdmin.price}</p>
          <img src={selectedAdmin.images} className="h-auto w-60" />
          {selectedAdmin.hashtags &&
            Array.isArray(selectedAdmin.hashtags) &&
            selectedAdmin.hashtags.map((hashtag: string, index: number) => (
              <p key={index}>#{hashtag}</p>
            ))}
          <p>{selectedAdmin.content}</p>
          <button
            onClick={() => {
              if (quantity === 0) return;
              setQuantity(quantity - 1);
            }}
          >
            -
          </button>
          {quantity}
          <button
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            +
          </button>
          <button onClick={handleSignUp}>確定報名</button>
        </div>
      )}
    </div>
  );
});

export default Home;
