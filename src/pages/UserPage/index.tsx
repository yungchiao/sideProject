import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const UserPage: React.FC = observer(() => {
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
      appStore.fetchUserActivities();
    }
  }, [appStore.currentUserEmail]);

  return (
    <div className="mt-28">
      {appStore.newUser && (
        <div className="mx-auto mt-4  flex flex-wrap justify-center text-center">
          <div>
            <p className=" mt-4 flex justify-center">
              暱稱: {appStore.newUser.name}
            </p>
            <p className=" mt-4 flex justify-center">
              Email: {appStore.newUser.email}
            </p>
            <img
              src={appStore.newUser.avatar}
              alt="Avatar"
              className="mx-auto mt-4 flex h-40 w-40 rounded-full"
            />
          </div>
        </div>
      )}
      {appStore.userActivities.map((activity, index) => (
        <div
          key={`${activity.name}-${activity.startTime}-${index}`}
          className="mx-auto mt-4 w-3/4 rounded-lg border p-4"
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
    </div>
  );
});

export default UserPage;
