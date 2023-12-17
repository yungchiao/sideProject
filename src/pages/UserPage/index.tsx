import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import {
  Timestamp,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import Cart from "../../components/Cart";
import Detail from "../../components/Home/Detail";
import Like from "../../components/Like";
import GoogleMap from "../../components/Map/GoogleMap";
export const storage = getStorage(appStore.app);
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
const UserPage: React.FC = observer(() => {
  appStore.db = getFirestore(appStore.app);
  const auth = getAuth();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
      appStore.fetchUserActivities();
    }
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const userDocRef = doc(appStore.db, "user", userEmail);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      const userData = doc.data();
      if (userData && userData.avatar) {
        setAvatarUrl(userData.avatar);
      }
    });
    return () => unsubscribe();
  }, [appStore.currentUserEmail]);

  useEffect(() => {
    const currentUserName = appStore.newUser?.name || "";
    setUserName(currentUserName);
  }, [appStore.newUser]);

  const [isDetailFollower, setDetailFollower] = useState(false);
  const [isDetailFollowing, setDetailFollowing] = useState(false);
  const [isChangeAvatar, setChangeAvatar] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("/bear.jpg");
  const [userName, setUserName] = useState<string>("");
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleOpenFollower = () => {
    setDetailFollower(!isDetailFollower);
    isDetailFollowing
      ? setDetailFollowing(!isDetailFollowing)
      : setDetailFollowing(isDetailFollowing);
  };
  const toggleOpenFollowing = () => {
    setDetailFollowing(!isDetailFollowing);
    isDetailFollower
      ? setDetailFollower(!isDetailFollower)
      : setDetailFollower(isDetailFollower);
  };
  const handleFollowerClick = () => {
    toggleOpenFollower();
  };
  const handleFollowingClick = () => {
    toggleOpenFollowing();
  };
  const toggleChangeAvatar = () => {
    setChangeAvatar(!isChangeAvatar);
  };
  const handleChangeAvatar = () => {
    toggleChangeAvatar();
  };
  const nameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };
  const uploadImage = async (imageFile: File): Promise<string> => {
    const imageRef = ref(storage, `images/${imageFile.name + v4()}`);
    await uploadBytes(imageRef, imageFile);
    return getDownloadURL(imageRef);
  };
  const handleSubmit = async () => {
    try {
      const NameData = {
        name: userName,
      };
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        throw new Error("找不到該用戶！");
      }
      const userDocRef = doc(appStore.db, "user", userEmail);
      await updateDoc(userDocRef, NameData);
      alert("名稱更新成功！");
    } catch (error) {
      console.error("更改名稱失敗", error);
      alert("更改名稱失敗");
    }
  };
  const [activeTab, setActiveTab] = useState("post");

  const handleTabChange = (tabKey: any) => {
    setActiveTab(tabKey);
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
  return (
    <div>
      {appStore.newUser ? (
        <>
          <div className=" mx-auto mt-4  flex  flex-wrap justify-center pt-28 text-center">
            <div className=" relative">
              <div className=" flex items-center justify-end gap-2">
                <input
                  maxLength={20}
                  className="my-4 flex w-40 justify-center bg-stone-100"
                  value={userName ? userName : "某位探險家"}
                  onChange={nameChange}
                />
                <Button onClick={handleSubmit}>完成</Button>
              </div>
              <p className=" mx-24 mt-4  flex justify-center">
                Email: {appStore.newUser.email}
              </p>
              <div className="relative">
                <img
                  src={avatarUrl ? avatarUrl : "/bear.jpg"}
                  alt="Avatar"
                  className="relative mx-auto mt-4 flex h-40 w-40 rounded-full object-cover"
                />
                <button
                  className="absolute  bottom-5 right-28 h-10 w-10 rounded-full border-1 border-stone-600 bg-white shadow-md transition duration-200 hover:scale-105 hover:border-none hover:bg-yellow"
                  onClick={handleChangeAvatar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1"
                    stroke="currentColor"
                    className="hover:strokeWidth mx-2 flex h-6 w-6 justify-center  hover:stroke-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>

                <div className="   flex justify-end">
                  {isChangeAvatar && (
                    <div className="  absolute right-2 top-24 ml-4 h-auto  w-24 justify-center rounded-md    bg-white py-1">
                      <Link to="/paint" className="text-brown">
                        繪製頭貼
                      </Link>

                      <div className="container mx-auto mt-2">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImageUpload(e.target.files[0]);
                              try {
                                const imageUrl = await uploadImage(
                                  e.target.files[0],
                                );
                                const userEmail = auth.currentUser?.email;
                                if (!userEmail) {
                                  throw new Error("找不到該用戶！");
                                }
                                const userDocRef = doc(
                                  appStore.db,
                                  "user",
                                  userEmail,
                                );
                                await updateDoc(userDocRef, {
                                  avatar: imageUrl,
                                });
                                alert("頭貼更新成功！");
                              } catch (error) {
                                console.error("更改頭貼失敗", error);
                                alert("更改頭貼失敗");
                              }
                            } else {
                              setImageUpload(null);
                            }
                          }}
                        />
                        <label
                          htmlFor="file-upload"
                          className=" cursor-pointer rounded bg-brown px-4 py-2 font-bold text-white "
                        >
                          上傳檔案
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-4">
                <div
                  className=" block cursor-pointer"
                  onClick={handleFollowerClick}
                >
                  <p>粉絲</p>
                  <p>{appStore.newUser.followers.length}</p>
                </div>
                <div className=" h-10 w-px bg-stone-800" />
                <div
                  className="block cursor-pointer"
                  onClick={handleFollowingClick}
                >
                  <p>追蹤</p>
                  <p>{appStore.newUser.following.length}</p>
                </div>
              </div>
              {isDetailFollower && (
                <div className="gap-4">
                  {appStore.newUser.followers.map((follower, index) => (
                    <p key={index}>{follower}</p>
                  ))}
                </div>
              )}
              {isDetailFollowing && (
                <div className="gap-4 ">
                  {appStore.newUser.following.map((following, index) => (
                    <p key={index}>{following}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto mb-6   rounded-lg  p-4">
            <div className="flex justify-center ">
              <button
                className={`px-4 py-2 ${
                  activeTab === "post" ? "border-b-2 border-yellow" : ""
                }`}
                onClick={() => handleTabChange("post")}
              >
                貼文
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "ticket" ? "border-b-2 border-yellow" : ""
                }`}
                onClick={() => handleTabChange("ticket")}
              >
                票券
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "like" ? "border-b-2 border-yellow" : ""
                }`}
                onClick={() => handleTabChange("like")}
              >
                收藏
              </button>
            </div>
            {activeTab === "post" && (
              <div className="p-4">
                {appStore.userActivities.length > 0 ? (
                  <Card>
                    <CardBody>
                      {appStore.userActivities.map((activity, index) => (
                        <div
                          key={`${activity.name}-${activity.startTime}-${index}`}
                          className="mx-auto mt-6 w-3/4 rounded-lg border bg-white p-4"
                        >
                          <div className=" mb-4 flex items-center justify-center gap-2 border-b-2 px-2 pb-2">
                            <img
                              src={appStore.newUser?.avatar || "/bear.jpg"}
                              className="h-10 w-10 rounded-full"
                            />
                            <p>{activity.id}</p>
                          </div>
                          <div className="flex justify-center gap-6">
                            <div>
                              <div className="flex gap-6">
                                <div className="flex-none">
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
                                      className="background-cover"
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
                                <div className="h-[300px] w-[500px] rounded-md bg-stone-100 p-4 ">
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
                    </CardBody>
                  </Card>
                ) : (
                  <div className="mx-40  mt-4  justify-center rounded-md border p-4 text-center">
                    <h1 className="mb-4  items-center text-xl">
                      尚未分享文章!
                    </h1>
                    <Button>
                      <Link to="/post">前往社群</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "ticket" && (
              <div>
                <Card>
                  <CardBody>
                    <Cart />
                  </CardBody>
                </Card>
              </div>
            )}

            {activeTab === "like" && (
              <div>
                <Card>
                  <CardBody>
                    <Like />
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
          <div className="mb-10 flex justify-center">
            <h1 className="text-4xl">{userName} の 足跡</h1>
          </div>

          <GoogleMap />

          <div className="my-10  flex  justify-center">
            <Button onClick={appStore.logout} className="bg-green">
              <p className="mx-auto flex text-white">登出</p>
            </Button>
          </div>
        </>
      ) : (
        <div className="h-screen-bg  mx-40   flex items-center justify-center   text-center">
          <div className="block rounded-md border px-40 py-6">
            <h1 className="mb-4 text-3xl">登入後查看更多</h1>
            <Link to="/profile">
              <Button>登入</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserPage;
