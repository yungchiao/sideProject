import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import Detail from "../../components/Home/Detail";
import UserSearch from "./UserSearch";

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

const Activity: React.FC = observer(() => {
  const [activitiesWithAvatar, setActivitiesWithAvatar] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    console.log("Loading started");
    setIsLoading(true);
    appStore.fetchActivities().then(() => {
      console.log("Loading finished");
      setIsLoading(false);
    });
  }, [appStore.currentUserEmail]);

  useEffect(() => {
    appStore.fetchActivities().then(() => {
      updateActivitiesWithAvatars();
    });
  }, [appStore.activities]);

  const updateActivitiesWithAvatars = async () => {
    const updatedActivities = await Promise.all(
      appStore.activities.map(async (activity) => {
        const avatarUrl = await getUserAvatar(activity.id);
        return { ...activity, avatar: avatarUrl };
      }),
    );
    setActivitiesWithAvatar(updatedActivities);
  };

  const getUserAvatar = async (email: string) => {
    const userRef = doc(appStore.db, "user", email);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().avatar || "/bear.jpg";
    }
    return "/bear.jpg";
  };

  const handleAdminClick = (activity: any) => {
    const admin = appStore.admins.find((admin) => admin.name === activity.name);
    if (admin) {
      setSelectedAdmin(admin);
      toggleModal();
    }
  };
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
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
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className=" relative flex pb-20 pt-20">
        <div className="fixed left-[-50px] top-[-50px] grid h-[500px] w-[500px] content-center rounded-full bg-brown pl-[60px] pt-20 shadow-md transition duration-200 hover:scale-105 hover:bg-darkBrown">
          <div className=" flex items-center justify-center gap-2">
            <div className=" flex h-[40px] w-[240px] cursor-pointer items-center justify-center gap-2 rounded-lg   bg-yellow py-1 transition duration-200 hover:bg-darkYellow">
              <Link to="/userpost">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="white"
                    className="h-6 w-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  <p className="text-white">建立貼文</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="mt-4 grid justify-items-center">
            <UserSearch />
          </div>
        </div>
        <div className="ml-[550px]  w-2/3 pt-[20px]">
          {isLoading ? (
            <div className="loading-container">
              <img
                src="/loading.gif"
                alt="Loading..."
                className="h-full w-full"
              />
            </div>
          ) : activitiesWithAvatar.length > 0 ? (
            <div>
              {activitiesWithAvatar.map((activity) => (
                <div
                  key={activity.postId}
                  className="mt-4 w-4/5 rounded-lg border bg-white p-4 px-[20px]"
                >
                  <div className=" mb-4 flex items-center justify-center gap-2 border-b-2 px-2 pb-2">
                    <img
                      src={activity.avatar}
                      className="h-10 w-10 rounded-full"
                    />
                    <p>{activity.id}</p>
                  </div>
                  <div className="flex justify-center gap-6">
                    <div>
                      <div className="flex justify-between gap-6">
                        <div>
                          <h3
                            className="mb-3 cursor-pointer text-lg font-bold text-brown transition duration-200 hover:scale-105 hover:text-darkBrown"
                            onClick={() => handleAdminClick(activity)}
                          >
                            {activity.name}
                          </h3>
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

                          <div className="mt-8 flex flex-col">
                            {activity.hashtags.map(
                              (hashtag: string, index: number) => (
                                <div className="hashtag mb-2 flex h-8 w-auto items-center rounded-full p-4">
                                  <p
                                    key={index}
                                    className="whitespace-nowrap text-stone-800"
                                  >
                                    #{hashtag}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                        <div className="mx-[5px] h-[300px] min-w-[300px] rounded-md bg-stone-100 p-4">
                          <p>{activity.content}</p>
                        </div>

                        <div className="h-[300px] w-[300px] overflow-hidden rounded-md border p-2 shadow-md">
                          <img
                            src={activity.image}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-screen-bg ml-[60px] flex items-center  text-center">
              <div className="block rounded-md border px-40 py-6">
                <h1 className="my-4 text-3xl">追蹤好友查看更多貼文！</h1>
              </div>
            </div>
          )}
        </div>
        <div
          className=" absolute bottom-10 right-10 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-green shadow-lg transition duration-200 hover:scale-105 hover:bg-darkGreen"
          onClick={scrollToTop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="white"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default Activity;
