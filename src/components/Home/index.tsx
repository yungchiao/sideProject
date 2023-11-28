import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@nextui-org/react";
import "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import Calendar from "../../pages/Calendar";
import Detail from "./Detail";

const Home: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [likeItems, setLikeItems] = useState<LikeItem[]>([]);

  const handleAdminClick = (admin: any) => {
    setSelectedAdmin(admin);
    toggleModal();
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
  }, [appStore.currentUserEmail]);

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

  const handleAddToLike = (admin: Admin) => {
    const likeItem: LikeItem = {
      id: admin.id,
      name: admin.name,
      images: admin.images,
      position: admin.position,
      price: admin.price,
      startTime: admin.startTime,
      endTime: admin.endTime,
    };
    const userEmail = appStore.currentUserEmail;
    if (userEmail) {
      appStore.newLike(userEmail, likeItem);
      alert("加入收藏成功！");
    } else {
      alert("用戶未登入");
    }
  };

  function deleteItem(admin: Admin) {
    if (appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((item) => item.id !== admin.id);
      setLikeItems(newLikeItems);

      appStore.deleteFromLike(appStore.currentUserEmail, admin.id);
      window.alert("取消收藏");
    }
  }

  const handleIconClick = (admin: Admin) => {
    const updatedAdmins = appStore.admins.map((a) => {
      if (a.id === admin.id) {
        if (a.isLiked) {
          deleteItem(admin);
        } else {
          handleAddToLike(admin);
        }
        return { ...a, isLiked: !a.isLiked };
      }
      return a;
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
            className="inline-block cursor-pointer"
          >
            {admin.name}
          </h3>
          <br />
          <p className="inline-block ">
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
            className="absolute right-5 top-5 h-8 w-8 cursor-pointer"
            fill={admin.isLiked ? "red" : "transparent"}
            onClick={() => handleIconClick(admin)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
      ))}

      <Modal
        isOpen={isModalOpen}
        onOpenChange={toggleModal}
        className="fixed left-1/2 top-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 transform border bg-white shadow-lg"
      >
        <ModalContent>
          <ModalBody>
            {selectedAdmin && (
              <Detail
                selectedAdmin={selectedAdmin}
                quantity={quantity}
                setQuantity={setQuantity}
                handleSignUp={handleSignUp}
              />
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              className="mb-4 bg-stone-800"
              variant="light"
              onPress={toggleModal}
            >
              <p className=" text-white">確定</p>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="mb-10 flex w-full justify-center ">
        <Calendar />
      </div>
    </div>
  );
});

export default Home;
