import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem, LikeItem } from "../../type";
import { GlobalButton } from "../../components/Button";

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
      toast.success("取消收藏");
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
    <div className="">
      <div className="rounded-lg text-center ">
        {likeItems.length > 0 ? (
          <>
            {likeItems.map((item, index) => (
              <div
                key={index}
                className="mb-4 block items-center justify-between rounded-md border bg-white p-4  lg:flex"
              >
                <p
                  className="mb-4 cursor-pointer whitespace-nowrap text-lg font-bold text-brown transition duration-200 hover:scale-105 hover:text-darkBrown lg:mb-0"
                  onClick={() => handleAdminClick(item)}
                >
                  {item.name}
                </p>
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
                <div className="mb-4 flex justify-center gap-2 lg:mb-0">
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
                  <p className="whitespace-nowrap">{item.position}</p>
                </div>

                <div className="mb-4 lg:mb-0">
                  <p className=" flex justify-center">
                    {item.startTime?.toDate()?.toLocaleString()}{" "}
                  </p>
                  <p className="my-1 flex justify-center text-xs">|</p>
                  <p className="flex justify-center">
                    {item.endTime?.toDate()?.toLocaleString()}{" "}
                  </p>
                </div>

                <div className=" mb-4 rounded-lg border p-2 lg:mb-0 lg:p-1">
                  <div className="overflow-hidden rounded-md">
                    <img
                      src={item.images}
                      className="h-auto w-full object-cover lg:h-16 lg:w-16"
                    />
                  </div>
                </div>
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
          <div className="flex justify-center ">
            <div className="mt-6 w-4/5 rounded-md border p-4 text-center lg:w-1/2">
              <h1 className="mb-4 items-center whitespace-nowrap text-xl">
                尚未收藏活動!
              </h1>
              <GlobalButton variant="gray" content="回首頁逛逛" to="/" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
export default Like;
