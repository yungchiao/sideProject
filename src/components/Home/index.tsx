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
    isLiked?: boolean;
  }
  interface CartItem {
    name: string;
    quantity: number;
    price: number;
    id: string;
  }
  interface LikeItem {
    id: string;
    name: string;
    images: string;
    position: string;
    price: number;
    startTime: Timestamp;
    endTime: Timestamp;
  }

  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [likeItems, setLikeItems] = useState<LikeItem[]>([]);

  const toggleDetail = () => {
    setDetailOpen(!isDetailOpen);
  };

  const handleAdminClick = (admin: any) => {
    setSelectedAdmin(admin);
    toggleDetail();
  };

  useEffect(() => {
    appStore.fetchAdmin();

    const userEmail = appStore.currentUserEmail;
    if (userEmail) {
      appStore.fetchLike(userEmail).then((likedItems) => {
        const updatedAdmins = appStore.admins.map((admin) => {
          const isLiked = likedItems.some((item: any) => item.id === admin.id);
          return { ...admin, isLiked };
        });

        appStore.setAdmins(updatedAdmins);
      });
    }
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
        appStore.newCart(userEmail, cartItem);
        alert("加入訂單成功！");
      } else {
        alert("用戶未登入");
      }
    } else {
      alert("請選擇數量");
    }
  };

  const handleAddToLike = () => {
    if (selectedAdmin) {
      const likeItem: LikeItem = {
        id: selectedAdmin.id,
        name: selectedAdmin.name,
        images: selectedAdmin.images,
        position: selectedAdmin.position,
        price: selectedAdmin.price,
        startTime: selectedAdmin.startTime,
        endTime: selectedAdmin.endTime,
      };
      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.newLike(userEmail, likeItem);
        alert("收藏成功！");
      } else {
        alert("用戶未登入");
      }
    }
  };

  function deleteItem(itemId: string) {
    const itemToDelete = likeItems.find((item) => item.id === itemId);

    if (itemToDelete && appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((item) => item.id !== itemId);
      setLikeItems(newLikeItems);

      appStore.deleteFromLike(appStore.currentUserEmail, itemId);
      window.alert("取消收藏");
    }
  }

  const handleIconClick = (adminId: string) => {
    const updatedAdmins = appStore.admins.map((admin) => {
      if (admin.id === adminId) {
        if (admin.isLiked) {
          deleteItem(admin.id);
        } else {
          handleAddToLike();
        }
        return { ...admin, isLiked: !admin.isLiked };
      }
      return admin;
    });

    appStore.setAdmins(updatedAdmins);
  };

  return (
    <div className=" mt-28">
      {appStore.admins.map((admin: Admin) => (
        <div
          key={admin.id}
          className="relative mx-auto mt-4 w-3/4  rounded-lg border p-4"
        >
          <h3
            onClick={() => handleAdminClick(admin)}
            className="cursor-pointer"
          >
            {admin.name}
          </h3>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="0.8"
            stroke="currentColor"
            className="absolute right-5 top-5 h-8 w-8"
            fill={admin.isLiked ? "red" : "none"}
            onClick={() => handleIconClick(admin.id)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
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
