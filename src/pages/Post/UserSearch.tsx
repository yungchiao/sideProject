import { Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { UserFollow, appStore } from "../../AppStore";
import UserProfile from "./UserProfile";
const UserSearch: React.FC = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
    {},
  );
  useEffect(() => {
    const newVisibilityMap: Record<string, boolean> = {};
    appStore.searchResults.forEach((user) => {
      newVisibilityMap[user.userEmail] = true;
    });
    setVisibilityMap(newVisibilityMap);
  }, [appStore.searchResults]);
  const handleSearch = () => {
    appStore.searchUsers(searchTerm);
  };
  const toggleVisibility = (email: string) => {
    setVisibilityMap((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  return (
    <>
      <div className="input-button-container flex justify-center">
        <Input
          classNames={{
            base: "max-w-[full]  h-10 ",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="搜尋完整帳號..."
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="mr-6 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      {appStore.searchResults.map((user: UserFollow) => (
        <div key={user.userEmail} className="mt-5 block">
          <UserProfile
            user={user}
            isVisible={visibilityMap[user.userEmail]}
            toggleVisibility={toggleVisibility}
          />
        </div>
      ))}
    </>
  );
});

export default UserSearch;
