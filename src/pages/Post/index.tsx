import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import UserSearch from "./UserSearch";

const Activity: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchActivities();
  }, []);

  return (
    <div className="pb-40 pt-28">
      <UserSearch />

      <div className="relative">
        <div className="fixed bottom-8 right-8 z-50 h-10 w-10 cursor-pointer rounded-full bg-stone-700">
          <p className="flex items-center justify-center text-3xl text-gray-100">
            <Link to="/userpost">+</Link>
          </p>
        </div>
      </div>

      {appStore.activities.map((activity) => (
        <div
          key={activity.postId}
          className="mx-auto mt-4 w-3/4 rounded-lg border bg-white p-4"
        >
          <div className="mb-4 flex items-center gap-2 border-b-2 px-2 pb-2">
            <img src={activity.avatar} className="h-10 w-10 rounded-full" />
            <p>{activity.id}</p>
          </div>
          <h3>{activity.name}</h3>
          <p>{activity.startTime?.toDate()?.toLocaleString()}</p>
          <p>{activity.endTime?.toDate()?.toLocaleString()}</p>
          <img src={activity.image} className="h-auto w-60" />
          <p>{activity.weather}</p>
          <p>{activity.position}</p>
          {activity.hashtags.map((hashtag: string, index: number) => (
            <p key={index} className="text-orange-900">
              #{hashtag}
            </p>
          ))}
          <p>{activity.content}</p>
        </div>
      ))}
    </div>
  );
});

export default Activity;
