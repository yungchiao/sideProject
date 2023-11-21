import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { UserFollow, appStore } from "../../AppStore";

interface UserProfileProps {
  user: UserFollow;
}

const UserProfile: React.FC<UserProfileProps> = observer(({ user }) => {
  const isFollowing =
    appStore.newUser?.following.includes(user.userEmail) || false;

  const handleFollowClick = () => {
    if (isFollowing) {
      appStore.unfollowUser(user.userEmail);
    } else {
      appStore.followUser(user.userEmail);
      appStore.addFollowUser(user.userEmail);
    }
  };

  return (
    <div className=" mt-2 flex items-center justify-center">
      <h3>{user.userName}</h3>
      <p>{user.userEmail}</p>
      <Button
        onClick={handleFollowClick}
        className="ml-2 border border-stone-800 bg-white"
      >
        {isFollowing ? "取消追蹤" : "追蹤"}
      </Button>
    </div>
  );
});

export default UserProfile;
