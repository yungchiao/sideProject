import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import { SearchIcon } from "./SearchIcon.tsx";

const Header: React.FC = observer(() => {
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
        <NavbarItem className="list-none">
          <Link color="foreground" to="/chat">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="ml-1 h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
          </Link>
        </NavbarItem>
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
