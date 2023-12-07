import {
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import Detail from "../../components/Home/Detail";

const North: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  interface Admin {
    id: string;
    name: string;
    place: string;
    price: number;
    images: string;
    hashtags: [];
    startTime: Timestamp;
    endTime: Timestamp;
    content: string;
    isLiked?: boolean;
    latitude: string;
    longitude: string;
  }
  interface CartItem {
    name: string;
    quantity: number;
    price: number;
    id: string;
    latitude: string;
    longitude: string;
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
    appStore.fetchNorthAdmin();

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
        latitude: selectedAdmin.latitude,
        longitude: selectedAdmin.longitude,
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
      position: admin.place,
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
  const getGoogleMapsLink = (latitude: any, longitude: any) => {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };
  return (
    <div className="  px-10 pb-40 pt-28">
      <div className="  mb-20 grid  grid-cols-2 gap-4 md:grid-cols-3">
        {appStore.admins.map((admin: Admin) => (
          <Card
            key={admin.id}
            className="relative mx-auto w-full rounded-lg border bg-white p-4 transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <CardBody className="overflow-visible p-0 ">
              <h3
                onClick={() => handleAdminClick(admin)}
                className="inline-block cursor-pointer font-bold"
              >
                {admin.name}
              </h3>
              <br />
              <p className="inline-block text-xs">
                {admin.startTime?.toDate()?.toLocaleString()}-
                {admin.endTime?.toDate()?.toLocaleString()}
              </p>
              <div className="my-2 flex w-auto justify-center rounded-full border-2 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <p className="text-center text-yellow-800">
                  {admin.latitude && admin.longitude ? (
                    <a
                      href={getGoogleMapsLink(admin.latitude, admin.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {admin.place}
                    </a>
                  ) : (
                    <span>{admin.place}</span>
                  )}
                </p>
              </div>
              <p>活動費用：NT${admin.price} 元</p>
              <div className="my-5 h-40 w-40 overflow-hidden">
                <img
                  src={admin.images}
                  className=" h-full w-full object-cover"
                />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="0.8"
                stroke="currentColor"
                className="absolute right-0 top-0 h-8 w-8 cursor-pointer"
                fill={admin.isLiked ? "red" : "transparent"}
                onClick={() => handleIconClick(admin)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </CardBody>
            <CardFooter className="block text-small">
              {" "}
              {admin.hashtags &&
                Array.isArray(admin.hashtags) &&
                admin.hashtags.map((hashtag: string, index: number) => (
                  <p key={index}>#{hashtag}</p>
                ))}
            </CardFooter>
          </Card>
        ))}
        <Modal
          isOpen={isModalOpen}
          onOpenChange={toggleModal}
          className="fixed left-1/2 top-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 transform gap-4 border bg-white shadow-lg"
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
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
});

export default North;
