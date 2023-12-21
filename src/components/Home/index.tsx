import "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import Calendar from "../../pages/Calendar";
import ActivityCard from "../AdminCard";
import Carousal from "./Carousel";
import HeroHeader from "./HeroHeader";
import { Admin, CartItem, LikeItem } from "../../type";

const Home: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
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
  const getGoogleMapsLink = (latitude: string, longitude: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  };

  return (
    <div className="relative pb-10 pt-20">
      <div className="">
        <HeroHeader />
      </div>
      <div className="w-full bg-white bg-[url('/lat.png')] bg-contain bg-no-repeat py-10">
        <div className="mb-30 tranition mx-auto flex h-auto w-3/4 justify-center px-10  duration-300 hover:scale-105">
          <Carousal />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 bg-stone-200 px-40 py-20  md:grid-cols-4">
        {appStore.admins.map((admin: Admin) => (
          <ActivityCard
            admin={admin}
            handleAdminClick={handleAdminClick}
            handleIconClick={handleIconClick}
            getGoogleMapsLink={getGoogleMapsLink}
          />
        ))}

        {isModalOpen && (
          <div className="background-cover " onClick={toggleModal}></div>
        )}
        {isModalOpen && selectedAdmin && (
          <ActivityModal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            selectedAdmin={selectedAdmin}
            quantity={quantity}
            setQuantity={setQuantity}
            handleSignUp={handleSignUp}
          />
        )}
      </div>
      <div className="py-10">
        <Calendar />
      </div>
    </div>
  );
});

export default Home;
