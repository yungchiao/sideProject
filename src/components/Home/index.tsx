import {
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import Calendar from "../../pages/Calendar";
import Carousal from "./Carousel";
import Detail from "./Detail";
import HeroHeader from "./HeroHeader";

const Home: React.FC = observer(() => {
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
    <div className="pb-10 pt-20">
      <div className="">
        <HeroHeader />
      </div>
      <div className="w-full bg-white bg-[url('/lat.png')] bg-contain bg-no-repeat py-10">
        <div className="mb-30 tranition mx-auto flex h-auto w-3/4 justify-center px-10  duration-300 hover:scale-105">
          <Carousal />
        </div>
      </div>
      <div className="grid  grid-cols-2 gap-8 bg-stone-200 px-20 pb-6 pt-20 md:grid-cols-3">
        {appStore.admins.map((admin: Admin) => (
          <div className="relative">
            <Card
              key={admin.id}
              className="relative mx-auto w-full rounded-lg border bg-white p-4 transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
            >
              <CardBody className="flex overflow-visible p-0">
                <div className="absolute left-1/2 top-[-100px] -translate-x-1/2 transform">
                  <div className="mx-auto flex h-[400px] w-[400px] justify-center overflow-hidden rounded-full">
                    <img
                      src={admin.images}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className=" mt-[320px]  flex justify-center">
                  <h3
                    onClick={() => handleAdminClick(admin)}
                    className="inline-block cursor-pointer text-lg font-bold text-brown"
                  >
                    {admin.name}
                  </h3>
                </div>
                <br />
                <p className=" mb-4 flex justify-center text-sm">
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
                  <p className="flex justify-center text-center font-bold text-brown">
                    {admin.latitude && admin.longitude ? (
                      <a
                        href={getGoogleMapsLink(
                          admin.latitude,
                          admin.longitude,
                        )}
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
                <div className="my-4 flex justify-center">
                  <p>
                    活動費用：NT${" "}
                    <span className="text-xl font-bold text-green">
                      {admin.price}
                    </span>{" "}
                    元
                  </p>
                </div>{" "}
                <div className="mb-8 mt-4 flex gap-4">
                  {admin.hashtags &&
                    Array.isArray(admin.hashtags) &&
                    admin.hashtags.map((hashtag: string, index: number) => (
                      <div className="hashtag flex h-8 w-auto items-center  rounded-full p-4">
                        <p
                          key={index}
                          className="  whitespace-nowrap text-stone-800"
                        >
                          #{hashtag}
                        </p>
                      </div>
                    ))}
                </div>
              </CardBody>
            </Card>
            <div className="absolute  right-[-12px] top-[-12px] flex  h-12 w-12 rounded-full  bg-yellow ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="0"
                stroke="currentColor"
                className=" bottom-0 right-0 h-8 w-8 translate-x-1/4 translate-y-1/3 transform cursor-pointer"
                fill={admin.isLiked ? "#98816a" : "white"}
                onClick={() => handleIconClick(admin)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </div>
          </div>
        ))}

        {isModalOpen && (
          <div className="background-cover" onClick={toggleModal}></div>
        )}

        <Modal
          isOpen={isModalOpen}
          onOpenChange={toggleModal}
          className="fixed left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 transform gap-4 border border-b-[20px] border-b-green bg-white shadow-lg"
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
      <Calendar />
    </div>
  );
});

export default Home;
