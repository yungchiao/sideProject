import { doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import UserSearch from "./UserSearch";
const Activity: React.FC = observer(() => {
  const [activitiesWithAvatar, setActivitiesWithAvatar] = useState<any[]>([]);

  useEffect(() => {
    appStore.fetchActivities().then(() => {
      updateActivitiesWithAvatars();
    });
  }, []);

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
    <div className=" flex  pb-20 pt-20">
      <div className="fixed left-[-50px] top-[-50px] grid h-[500px] w-[500px] content-center rounded-full bg-stone-400 pl-[60px] pt-20 shadow-md">
        <div className=" flex items-center justify-center gap-2">
          <div className=" flex h-[40px] w-[240px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-stone-800 bg-white py-1">
            <div className="flex">
              <Link to="/userpost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="black"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
            </div>
            <p className="">建立貼文</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <UserSearch />
        </div>
      </div>
      <div className="ml-[550px]  w-2/3 pt-[20px]">
        {activitiesWithAvatar.map((activity) => (
          <div
            key={activity.postId}
            className="mt-4 w-4/5 rounded-lg border bg-white p-4 px-[20px]"
          >
            <div className=" mb-4 flex items-center justify-center gap-2 border-b-2 px-2 pb-2">
              <img src={activity.avatar} className="h-10 w-10 rounded-full" />
              <p>{activity.id}</p>
            </div>
            <div className="flex justify-center gap-6">
              <div>
                <div className="flex justify-between gap-6">
                  <div className="">
                    <h3 className="mb-3 text-lg font-bold text-brown">
                      {activity.name}
                    </h3>
                    <div className="flex gap-3">
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
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                        />
                      </svg>
                      <div className="h-[40px] w-[3px] bg-yellow" />
                      <div>
                        <p>{activity.startTime?.toDate()?.toLocaleString()}</p>
                        <p>{activity.endTime?.toDate()?.toLocaleString()}</p>
                      </div>
                    </div>
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
                    <div className="mt-4 flex gap-3">
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
                      <div className="h-[30px] w-[3px] bg-yellow" />
                      <p>{activity.position}</p>
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
    </div>
  );
});

export default Activity;
