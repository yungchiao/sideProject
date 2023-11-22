import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import { SearchIcon } from "./SearchIcon.tsx";

const Header: React.FC = observer(() => {
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
    }
  }, []);
  return (
    <Navbar isBordered className="fixed top-0  z-20 border-b-2 bg-white p-6">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link color="foreground" to="/">
            ICON
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden gap-3 sm:flex">
          <NavbarItem>
            <Link color="foreground" to="/profile">
              登入
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link to="/post" aria-current="page" color="secondary">
              社群
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" to="/cart">
              訂單
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" to="/chat">
              客服聊聊
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        <Link to="/userpage">
          {appStore.newUser ? (
            <div>
              <img
                className="h-10 w-10 rounded-full"
                src={appStore.newUser.avatar}
                alt="Avatar"
              />
            </div>
          ) : (
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
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          )}
        </Link>
      </NavbarContent>
    </Navbar>
  );
});

export default Header;
