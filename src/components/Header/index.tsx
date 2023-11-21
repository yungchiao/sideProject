import {
  Avatar,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import React from "react";
import { Link } from "react-router-dom";
import { SearchIcon } from "./SearchIcon.tsx";

const Header: React.FC = () => {
  return (
    <Navbar isBordered className="fixed top-0  z-20 border-b-2 bg-white p-6">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link color="foreground" to="/">
            <p className="hidden font-bold text-inherit sm:block">ICON</p>
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
          <Avatar
            isBordered
            as="button"
            className="h-10 w-10 cursor-pointer rounded-full transition-transform"
            color="secondary"
            name="Jason Hughes"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </Link>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
