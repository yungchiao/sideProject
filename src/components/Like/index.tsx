import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import Detail from "../../components/Home/Detail";
interface LikeItem {
  id: string;
  name: string;
  images: string;
  position: string;
  price: number;
  startTime: Timestamp;
  endTime: Timestamp;
}
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
  place: string;
  longitude: string;
  latitude: string;
}
interface CartItem {
  name: string;
  quantity: number;
  price: number;
  id: string;
}
const Like: React.FC = observer(() => {
  const [likeItems, setLikeItems] = useState<LikeItem[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    const fetchLikeData = async () => {
      const userId = appStore.currentUserEmail;
      if (userId) {
        const likeData = await appStore.fetchLike(userId);
        setLikeItems(likeData);
      }
    };

    fetchLikeData();
  }, [appStore.currentUserEmail]);

  function deleteItem(itemIndex: any) {
    const itemToDelete = likeItems[itemIndex];

    if (itemToDelete && appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((_, index) => index !== itemIndex);
      setLikeItems(newLikeItems);

      appStore.deleteFromLike(appStore.currentUserEmail, itemToDelete.id);
      window.alert("取消收藏");
    }
  }
  const handleAdminClick = (item: any) => {
    const admin = appStore.admins.find((admin) => admin.name === item.name);
    if (admin) {
      setSelectedAdmin(admin);
      toggleModal();
    }
  };
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

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
  return (
    <div className="mx-auto mt-4 w-4/5  rounded-lg  p-4">
      {likeItems.length > 0 ? (
        <>
          {likeItems.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex items-center justify-between rounded-md border bg-white p-4"
            >
              <p
                className="cursor-pointer text-lg font-bold text-brown transition duration-200 hover:scale-105 hover:text-darkBrown"
                onClick={() => handleAdminClick(item)}
              >
                {item.name}
              </p>
              {isModalOpen && (
                <div className="background-cover" onClick={toggleModal}></div>
              )}
              {isModalOpen && selectedAdmin && (
                <Modal
                  isOpen={isModalOpen}
                  onOpenChange={toggleModal}
                  className="fixed left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 transform gap-4 border border-b-[20px] border-b-green bg-white shadow-lg"
                >
                  <ModalContent>
                    <ModalBody>
                      <Detail
                        selectedAdmin={selectedAdmin}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleSignUp={handleSignUp}
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              )}
              <p>{item.position}</p>
              <p>
                {item.startTime?.toDate()?.toLocaleString()}-
                {item.endTime?.toDate()?.toLocaleString()}
              </p>
              <img src={item.images} className="h-16 w-16" />
              <button onClick={() => deleteItem(index)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="0.8"
                  stroke="currentColor"
                  className=" h-8 w-8 cursor-pointer"
                  fill="#98816a"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className="mx-40    justify-center rounded-md border p-4 text-center">
          <h1 className="mb-4  items-center text-xl">尚未收藏活動!</h1>
          <Button>
            <Link to="/">回首頁逛逛</Link>
          </Button>
        </div>
      )}
    </div>
  );
});
export default Like;
