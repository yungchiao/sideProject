import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem, LikeItem } from "../../type.ts";

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
        longitude: selectedAdmin.longitude,
        latitude: selectedAdmin.latitude,
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
    <div className="mx-auto mt-4 w-3/5  rounded-lg px-8 py-4">
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
              <div className="flex gap-2">
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
                <p>{item.position}</p>
              </div>
              <div className="flex gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  data-slot="icon"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>

                <p>
                  {item.startTime?.toDate()?.toLocaleString()}-
                  {item.endTime?.toDate()?.toLocaleString()}
                </p>
              </div>
              <div className=" rounded-lg border p-1">
                <div className="overflow-hidden rounded-md">
                  <img src={item.images} className="h-16 w-16 object-cover" />
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
