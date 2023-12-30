import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { ActivityCardProps, Admin, CartItem } from "../../type.ts";

const ActivityCard: React.FC<ActivityCardProps> = observer(
  ({ activity, customAvatar }) => {
    const avatar = customAvatar || activity.avatar;

    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [quantity, setQuantity] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formatMessageTime = (timestamp: any) => {
      if (timestamp && typeof timestamp.toDate === "function") {
        const date = timestamp.toDate();
        return date.toLocaleString("zh-TW", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        return "某個時間點";
      }
    };
    const handleAdminClick = (activity: any) => {
      const admin = appStore.admins.find(
        (admin) => admin.name === activity.name,
      );
      if (admin) {
        setSelectedAdmin(admin);
        toggleModal();
      }
    };
    const handleSignUp = () => {
      if (selectedAdmin && quantity > 0) {
        const cartItem: CartItem = {
          name: selectedAdmin.name,
          quantity: quantity,
          price: selectedAdmin.price,
          id: selectedAdmin.id,
          longitude: selectedAdmin.longitude,
          latitude: selectedAdmin.latitude,
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
    return (
      <div
        key={activity.postId}
        className="rounded-xl bg-white pb-4 pl-4 pr-8 pt-6"
      >
        <div className=" flex items-center gap-2 px-2   pb-4">
          <img src={avatar} className="h-10 w-10 rounded-full object-cover" />
          <p className="text-lg">{activity.userName}</p>
        </div>
        <div className="justify-spacing flex gap-6">
          <div>
            <div className="flex justify-center gap-4 md:gap-6">
              <div className="border-yellow-500 ml-[25px] border-l-2 "></div>
              <div>
                <h3
                  className="mb-3 inline cursor-pointer text-lg font-bold text-brown transition duration-200 hover:scale-105 hover:text-darkBrown hover:shadow-lg"
                  onClick={() => handleAdminClick(activity)}
                >
                  {activity.name}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-6 w-6">
                    <img
                      src="/weather.png"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="h-[30px] w-[3px] bg-yellow" />
                  <p>{activity.weather}</p>
                </div>
                <div className="sm:max-width-[40%] md:max-width-[80%] max-h-[400px]  overflow-auto py-4 sm:w-full md:w-full">
                  <p className="leading-8">{activity.content}</p>
                </div>
                <div className="h-auto w-full overflow-hidden rounded-md border p-2 shadow-md md:w-2/3">
                  <img
                    src={activity.image}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="my-4 block gap-4 md:flex">
                  {activity.hashtags.map((hashtag: string, index: number) => (
                    <div
                      className="hashtag mb-2 inline-flex h-8 w-auto items-center rounded-full p-4"
                      key={index}
                    >
                      <p className="whitespace-nowrap text-stone-800">
                        #{hashtag}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-7 text-sm text-gray-500">
              {formatMessageTime(activity.createdAt)}
            </div>
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
        <div className="border-yellow-500 mt-8 border-b"></div>
      </div>
    );
  },
);

export default ActivityCard;
