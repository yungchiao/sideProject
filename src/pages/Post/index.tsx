import { doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import ActivityCard from "./ActivityCard";
import UserSearch from "./UserSearch";

const Activity: React.FC = observer(() => {
  const [activitiesWithAvatar, setActivitiesWithAvatar] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Loading started");
    setIsLoading(true);

    async function fetchAndSetActivities() {
      await appStore.fetchActivities();
      console.log("Loading finished");
      setIsLoading(false);
    }

    fetchAndSetActivities();
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

  return (
    <div className="pt-10">
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
        <div className="ml-[550px] inline w-[50%] justify-center rounded-xl bg-white px-8 shadow-lg">
          {isLoading ? (
            <div className="loading-container">
              <img
                src="/loading.gif"
                alt="Loading..."
                className="h-full w-full"
              />
            </div>
          ) : activitiesWithAvatar.length > 0 ? (
            <div className="pt-4">
              {activitiesWithAvatar.map((activity) => (
                <ActivityCard key={activity.postId} activity={activity} />
              ))}{" "}
            </div>
          ) : (
            <div className="h-screen-bg ml-[60px] flex items-center  text-center">
              <div className="block rounded-md border px-40 py-6">
                <h1 className="my-4 text-3xl">追蹤好友查看更多貼文！</h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Activity;
