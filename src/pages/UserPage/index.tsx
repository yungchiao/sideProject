import { Button, Card, CardBody, Input, Tab, Tabs } from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import Cart from "../../components/Cart";
import Like from "../../components/Like";
import Map from "../../components/Map";
export const storage = getStorage(appStore.app);

const UserPage: React.FC = observer(() => {
  appStore.db = getFirestore(appStore.app);
  const auth = getAuth();
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
  const [avatarUrl, setAvatarUrl] = useState(appStore.newUser?.avatar);
  const [userName, setUserName] = useState<string>("");
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
  return (
    <div className="mt-28 ">
      {appStore.newUser && (
        <div className="mx-auto mt-4  flex  flex-wrap justify-center text-center">
          <div className=" relative">
            <div className=" flex items-center justify-center gap-2">
              <Input
                className="my-4 flex w-40 justify-center"
                value={userName}
                onChange={nameChange}
              />
              <Button onClick={handleSubmit}>完成</Button>
            </div>
            <p className=" mx-24 mt-4  flex justify-center">
              Email: {appStore.newUser.email}
            </p>
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="relative mx-auto mt-4 flex h-40 w-40 rounded-full"
              />
              <button
                className="absolute  bottom-5 right-28 h-10 w-10 rounded-full border-1 border-stone-600 bg-white"
                onClick={handleChangeAvatar}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  className="mx-2 flex h-6 w-6 justify-center"
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
                  <div className="  absolute right-2 top-24 ml-4 h-auto  w-24 justify-center rounded-md bg-stone-200 py-1">
                    <Link to="/paint">繪製頭貼</Link>

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
                              await updateDoc(userDocRef, { avatar: imageUrl });
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
                        className=" cursor-pointer rounded bg-stone-800 px-4 py-2 font-bold text-white "
                      >
                        上傳檔案
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" mt-6 flex items-center justify-center gap-4">
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
      )}
      <div className="mx-auto mb-6   rounded-lg p-4">
        <Tabs aria-label="Options" className="flex justify-center">
          <Tab key="post" title="貼文">
            <Card>
              <CardBody>
                {appStore.userActivities.map((activity, index) => (
                  <div
                    key={`${activity.name}-${activity.startTime}-${index}`}
                    className="mx-auto mt-6 w-3/4 rounded-lg border p-4"
                  >
                    <h3>{activity.name}</h3>
                    <p>{activity.startTime?.toDate()?.toLocaleString()}</p>
                    <p>{activity.endTime?.toDate()?.toLocaleString()}</p>
                    <img src={activity.image} className="h-auto w-60" />
                    <p>{activity.weather}</p>
                    <p>{activity.position}</p>
                    {activity.hashtags.map((hashtag: string, index: number) => (
                      <p key={index}>#{hashtag}</p>
                    ))}
                    <p>{activity.content}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          </Tab>
          <Tab key="ticket" title="票券">
            <Card>
              <CardBody>
                <Cart />
              </CardBody>
            </Card>
          </Tab>
          <Tab key="like" title="收藏">
            <Card>
              <CardBody>
                <Like />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <div className="my-4 flex justify-center">
        <Button onClick={appStore.logout}>
          <p className="mx-auto flex">登出</p>
        </Button>
      </div>
    </div>
  );
});

export default UserPage;
