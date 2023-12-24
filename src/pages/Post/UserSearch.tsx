import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { UserFollow, appStore } from "../../AppStore";
import UserProfile from "./UserProfile";

interface UserSearchProps {
  onSelectUser?: (email: string) => void;
  showFollowButton?: boolean;
  userProfileClassName?: string;
}
const UserSearch: React.FC<UserSearchProps> = observer(
  ({ onSelectUser, showFollowButton, userProfileClassName }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
      {},
    );
    const [isVisible, setIsvisible] = useState(false);
    useEffect(() => {
      const newVisibilityMap: Record<string, boolean> = {};
      appStore.searchResults.forEach((user) => {
        newVisibilityMap[user.userEmail] = true;
      });
      setVisibilityMap(newVisibilityMap);
    }, [appStore.searchResults]);
    const handleSearch = async () => {
      await appStore.searchUsers(searchTerm);
      setIsvisible(appStore.searchResults.length === 0);
    };

    const toggleVisibility = (email: string) => {
      setVisibilityMap((prev) => ({ ...prev, [email]: !prev[email] }));
    };
    const handleUserClick = (email: string) => {
      if (onSelectUser) {
        onSelectUser(email);
      }
    };
    const handleHideClick = () => {
      setIsvisible(false);
    };
    return (
      <div className="absolute  flex flex-col">
        <div className="relative flex h-10 w-60 justify-between rounded-lg bg-white ">
          <input
            className="input-placeholder relative w-[200px] rounded-lg pl-3 text-small font-normal  outline-none dark:bg-default-500/20"
            placeholder="搜尋完整帳號..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trim())}
          />
          <button
            onClick={handleSearch}
            className="relative right-0 top-0 mr-3 h-full bg-transparent"
          >
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
        <div>
          {appStore.searchResults.length > 0
            ? appStore.searchResults.map((user: UserFollow) => (
                <div
                  key={user.userEmail}
                  className=" left-[-30px] top-full z-10 mt-2 rounded-lg  p-3"
                  onClick={() => handleUserClick(user.userEmail)}
                >
                  <UserProfile
                    user={user}
                    isVisible={visibilityMap[user.userEmail]}
                    toggleVisibility={toggleVisibility}
                    onSelectUser={onSelectUser || (() => {})}
                    showFollowButton={showFollowButton}
                    className={userProfileClassName}
                  />
                </div>
              ))
            : isVisible && <p className="mr-4 inline text-white">查無此帳號</p>}
          {isVisible && (
            <button onClick={handleHideClick} className="mt-2">
              <p className="text-white">x</p>
            </button>
          )}
        </div>
      </div>
    );
  },
);

export default UserSearch;
