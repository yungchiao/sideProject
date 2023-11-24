import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import Cart from "../../components/Cart";
import Like from "../../components/Like";
const UserPage: React.FC = observer(() => {
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
      appStore.fetchUserActivities();
    }
  }, [appStore.currentUserEmail]);

  const [isDetailFollower, setDetailFollower] = useState(false);
  const [isDetailFollowing, setDetailFollowing] = useState(false);
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
  return (
    <div className="mt-28 ">
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
      <div className="mx-auto mt-4   rounded-lg p-4">
        <Tabs aria-label="Options" className="flex justify-center">
          <Tab key="post" title="貼文">
            <Card>
              <CardBody>
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
    </div>
  );
});

export default UserPage;
