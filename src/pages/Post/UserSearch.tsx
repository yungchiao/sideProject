import { Input } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { UserFollow, appStore } from "../../AppStore";
import { SearchIcon } from "../../components/Header/SearchIcon";
import UserProfile from "./UserProfile";
const UserSearch: React.FC = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    appStore.searchUsers(searchTerm);
  };

  return (
    <>
      <div className="flex justify-center">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[15rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="ml-2">
          搜尋帳號
        </button>
      </div>
      {appStore.searchResults.map((user: UserFollow) => (
        <div className="flex justify-center">
          <UserProfile key={user.userEmail} user={user} />
        </div>
      ))}
    </>
  );
});

export default UserSearch;
