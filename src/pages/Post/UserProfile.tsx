import { Button } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { UserFollow, appStore } from "../../AppStore";

interface UserProfileProps {
  user: UserFollow;
  isVisible: boolean;
  toggleVisibility: (email: string) => void;
  onSelectUser: (email: string) => void;
  className?: string;
}
const UserProfile: React.FC<
  UserProfileProps & {
    isVisible: boolean;
    toggleVisibility: (email: string) => void;
    onSelectUser: (email: string) => void;
    showFollowButton?: boolean;
    className?: string;
  }
> = observer(
  ({
    user,
    isVisible,
    toggleVisibility,
    onSelectUser,
    showFollowButton = true,
    className,
  }) => {
    const isFollowing =
      appStore.newUser?.following.includes(user.userEmail) || false;
    const handleClick = () => {
      onSelectUser(user.userEmail);
    };
    const handleFollowClick = () => {
      if (isFollowing) {
        appStore.unfollowUser(user.userEmail);
      } else {
        appStore.followUser(user.userEmail);
        appStore.addFollowUser(user.userEmail);
      }
    };
    const handleHideClick = () => {
      toggleVisibility(user.userEmail);
    };
    const combinedClassName = ` ${className ? className : "search-friend"}`;
    return (
      <div>
        {isVisible ? (
          <div className="flex items-center gap-4">
            <div className={combinedClassName}>
              <p onClick={handleClick}>{user.userEmail}</p>
              {showFollowButton && (
                <Button
                  onClick={handleFollowClick}
                  className="ml-2  bg-yellow hover:bg-darkYellow"
                >
                  <p className="text-white">
                    {isFollowing ? "取消追蹤" : "追蹤"}
                  </p>
                </Button>
              )}
            </div>
            <button onClick={handleHideClick} className="">
              <p className="text-yellow">x</p>
            </button>
          </div>
        ) : null}
      </div>
    );
  },
);

export default UserProfile;
