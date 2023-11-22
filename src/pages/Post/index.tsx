import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserFollow, appStore } from "../../AppStore";
import UserProfile from "./UserProfile";
import UserSearch from "./UserSearch";
interface UserProfileProps {
  user: UserFollow;
}

const Activity: React.FC<UserProfileProps> = observer(() => {
  useEffect(() => {
    appStore.fetchActivities();
  }, []);
  const renderUserProfile = () => {
    if (appStore.newUser) {
      const userFollow: UserFollow = {
        id: appStore.newUser.id,
        userName: appStore.newUser.name,
        userEmail: appStore.newUser.email,
      };
      return <UserProfile user={userFollow} />;
    }
    return null;
  };
  return (
    <div className="mt-28">
      <UserSearch />
      <div>{renderUserProfile()}</div>

      <div className="relative">
        <div className="fixed bottom-8 right-8 z-50 h-10 w-10 cursor-pointer rounded-full bg-stone-700">
          <p className="flex items-center justify-center text-3xl text-gray-100">
            <Link to="/userpost">+</Link>
          </p>
        </div>
      </div>

      {appStore.activities.map((activity) => (
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

export default Activity;
