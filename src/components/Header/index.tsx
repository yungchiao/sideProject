import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import Fuse from "fuse.js";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import Detail from "../Home/Detail.tsx";
import { SearchIcon } from "./SearchIcon.tsx";

const Header: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  // const openModal = () => setIsModalOpen(true);
  // const closeModal = () => setIsModalOpen(false);
  interface Admin {
    id: string;
    name: string;
    position: string;
    price: number;
    images: string;
    hashtags: [];
    startTime: Timestamp;
    endTime: Timestamp;
    content: string;
    isLiked?: boolean;
  }
  interface CartItem {
    name: string;
    quantity: number;
    price: number;
    id: string;
  }
  useEffect(() => {
    const userId = appStore.currentUserEmail;
    if (userId) {
      appStore.fetchUserData(userId);
    }
    appStore.fetchAdmin();
  }, [appStore.currentUserEmail]);
  const [headerSelectedAdmin, setHeaderSelectedAdmin] = useState<Admin | null>(
    null,
  );
  const [quantity, setQuantity] = useState(0);
  const [query, setQuery] = useState("");
  const fuse = new Fuse(appStore.admins, {
    keys: ["name", "position"],
  });

  const results = fuse.search(query);
  function handleOnSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.currentTarget;
    setQuery(value);
  }
  const handleSignUp = () => {
    if (headerSelectedAdmin && quantity > 0) {
      const cartItem: CartItem = {
        name: headerSelectedAdmin.name,
        quantity: quantity,
        price: headerSelectedAdmin.price,
        id: headerSelectedAdmin.id,
      };
      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.newCart(userEmail, cartItem);
        alert("加入訂單成功！");
      } else {
        alert("用戶未登入");
      }
    } else {
      alert("請選擇數量");
    }
  };
  const handleAdminClick = (admin: any) => {
    setHeaderSelectedAdmin(admin);
    toggleModal();
  };

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
          <NavbarItem isActive>
            <Link to="/about" aria-current="page" color="secondary">
              關於
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <div>
          {query && (
            <ul className="search-results">
              {results.length > 0 ? (
                results.map((result) => (
                  <li
                    key={result.item.id}
                    onClick={() => handleAdminClick(result.item)}
                    className="cursor-pointer"
                  >
                    {result.item.name}
                  </li>
                ))
              ) : (
                <li>查無活動</li>
              )}
            </ul>
          )}
        </div>
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
          value={query}
          onChange={handleOnSearch}
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
      <Modal
        isOpen={isModalOpen}
        onOpenChange={toggleModal}
        className="fixed left-1/2 top-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 transform border bg-white shadow-lg"
      >
        <ModalContent>
          <ModalBody>
            {headerSelectedAdmin && (
              <Detail
                selectedAdmin={headerSelectedAdmin}
                quantity={quantity}
                setQuantity={setQuantity}
                handleSignUp={handleSignUp}
              />
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              className="mb-4 bg-stone-800"
              variant="light"
              onPress={toggleModal}
            >
              <p className=" text-white">確定</p>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Navbar>
  );
});

export default Header;
