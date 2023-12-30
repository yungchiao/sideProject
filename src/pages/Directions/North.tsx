import "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import ActivityCard from "../../components/AdminCard";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem, LikeItem } from "../../type";
import { toast } from "react-toastify";
const North: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
        toast.success("加入訂單成功！");
      } else {
        toast.error("用戶未登入");
      }
    } else {
      toast.error("請選擇數量");
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
      toast.success("加入收藏成功！");
    } else {
      toast.error("用戶未登入");
    }
  };

  function deleteItem(admin: Admin) {
    if (appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((item) => item.id !== admin.id);
      setLikeItems(newLikeItems);
      appStore.deleteFromLike(appStore.currentUserEmail, admin.id);
      toast.error("取消收藏");
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
    <div className="bg-stone-200 pb-40 pt-28">
      <div className="grid grid-cols-2 gap-6 bg-stone-200 py-20 sm:grid-cols-1 sm:px-6  md:grid-cols-2 md:px-20 lg:grid-cols-3 lg:px-12 xl:grid-cols-4 xl:px-40">
        {appStore.admins.map((admin: Admin) => (
          <ActivityCard
            admin={admin}
            handleAdminClick={handleAdminClick}
            handleIconClick={handleIconClick}
            getGoogleMapsLink={getGoogleMapsLink}
          />
        ))}

        {isModalOpen && (
          <div
            className="background-cover bg-black/20"
            onClick={toggleModal}
          ></div>
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
    </div>
  );
});

export default North;
