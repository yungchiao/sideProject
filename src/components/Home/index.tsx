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
    date: Timestamp;
    content: string;
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
    if (selectedAdmin) {
      appStore.addToCart({ ...selectedAdmin, quantity });
      alert("加入訂單成功！");
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
            {admin.date?.toDate
              ? admin.date.toDate().toLocaleString()
              : "No Date"}
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
          <p>{selectedAdmin.date?.toDate()?.toLocaleString()}</p>
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
