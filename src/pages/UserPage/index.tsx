import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const UserPage: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchUserActivities();
  }, []);

  return (
    <div className="mt-28">
      {appStore.newUser && (
        <div>
          <p>暱稱: {appStore.newUser.name}</p>
          <p>Email: {appStore.newUser.email}</p>
          <img src={appStore.newUser.avatar} alt="Avatar" />
        </div>
      )}

      {appStore.userActivities.map((activity) => (
        <div
          key={activity.id}
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
