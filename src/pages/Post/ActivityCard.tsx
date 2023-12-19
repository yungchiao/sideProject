import { Timestamp, doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
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
interface ActivityCardProps {
  activity: {
    postId: string;
    avatar: string;
    id: string;
    name: string;
    weather: string;
    content: string;
    image: string;
    hashtags: string[];
    createdAt: Timestamp;
    userName: string;
  };
  customAvatar?: string;
}
const ActivityCard: React.FC<ActivityCardProps> = observer(
  ({ activity, customAvatar }) => {
    const avatar = customAvatar || activity.avatar;
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
    const [activitiesWithAvatar, setActivitiesWithAvatar] = useState<any[]>([]);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [quantity, setQuantity] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const getUserAvatar = async (email: string) => {
      const userRef = doc(appStore.db, "user", email);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().avatar || "/bear.jpg";
      }
      return "/bear.jpg";
    };
    const [isLoading, setIsLoading] = useState(true);
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
      <div key={activity.postId} className="   px-[20px] pt-6">
        <div className=" mb-4 flex items-center gap-2  px-2 pb-2">
          <img src={avatar} className="h-10 w-10 rounded-full object-cover" />
          <p className="text-lg">{activity.userName}</p>
        </div>
        <div className="justify-spacing flex gap-6">
          <div>
            <div className="flex gap-6">
              <div className="border-yellow-500 ml-[25px] border-l-2 pl-2"></div>
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
                <div className="max-width-[80%] max-h-[400px] overflow-auto py-4">
                  <p className="leading-8">{activity.content}</p>
                </div>
                <div className="h-[300px] w-[300px] overflow-hidden rounded-md border p-2 shadow-md">
                  <img
                    src={activity.image}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-8 inline-block flex-col">
                  {activity.hashtags.map((hashtag: string, index: number) => (
                    <div className="hashtag mb-2 flex h-8 w-auto items-center rounded-full p-4">
                      <p
                        key={index}
                        className="whitespace-nowrap text-stone-800"
                      >
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
