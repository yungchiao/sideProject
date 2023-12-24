import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Fuse from "fuse.js";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem } from "../../type";
import { SearchIcon } from "./SearchIcon.tsx";

const Header: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const auth = getAuth();
  useEffect(() => {
    const userId = appStore.currentUserEmail;
    if (userId) {
      appStore.fetchUserData(userId);
    }
    const userEmail = auth.currentUser?.email;
    if (!userEmail) return;
    const userDocRef = doc(appStore.db, "user", userEmail);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      const userData = doc.data();
      if (userData && userData.avatar) {
        setAvatarUrl(userData.avatar);
      }
    });
    appStore.fetchAdmin();
    return () => unsubscribe();
  }, [appStore.currentUserEmail]);
  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [headerSelectedAdmin, setHeaderSelectedAdmin] = useState<Admin | null>(
    null,
  );
  const [quantity, setQuantity] = useState(0);
  const [query, setQuery] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/bear.jpg");
  const [searchActive, setSearchActive] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const toggleSearch = () => {
    setSearchActive(!searchActive);
  };

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
        longitude: headerSelectedAdmin.longitude,
        latitude: headerSelectedAdmin.latitude,
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
  const handleAdminClick = (admin: Admin) => {
    setHeaderSelectedAdmin(admin);
    toggleModal();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Navbar isBordered className="fixed top-0  z-50 border-b-2 bg-white p-6">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Link color="foreground" to="/" onClick={scrollToTop}>
            <div className="h-10 w-10 overflow-hidden">
              <img src="/gravity-logo.png" />
            </div>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden gap-3 sm:flex">
          <NavbarItem isActive>
            <Link
              to="/post"
              aria-current="page"
              className="text-brown transition duration-200 hover:text-darkBrown "
              onClick={scrollToTop}
            >
              社群
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              to="/about"
              aria-current="page"
              className="text-brown transition duration-200 hover:text-darkBrown"
              onClick={scrollToTop}
            >
              關於
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as="div" className="items-center" justify="end">
        <div className="relative block ">
          <SearchIcon
            size={18}
            onClick={toggleSearch}
            className=" cursor-pointer md:hidden"
          />
          {(searchActive || isLargeScreen) && (
            <div className="absolute right-[-120px] top-[60px] mt-2 md:right-0   md:top-[-28px]">
              <input
                className="relative h-10 w-[10rem] max-w-full rounded-lg border border-brown bg-white px-2 text-small font-normal text-default-500 outline-transparent dark:bg-default-500/20"
                placeholder="搜尋活動..."
                type="search"
                value={query}
                onChange={handleOnSearch}
              />
              {query && (
                <ul className="search-results absolute left-0 top-full z-10 mt-4 w-full rounded-md bg-white px-2 shadow-lg">
                  {results.length > 0 ? (
                    results.map((result) => (
                      <li
                        key={result.item.id}
                        onClick={() => handleAdminClick(result.item)}
                        className="flex cursor-pointer flex-col transition duration-200 hover:text-stone-400"
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
          )}
        </div>
        <NavbarItem className="list-none">
          <Link
            to={
              appStore.currentUserEmail === "imadmin@gmail.com"
                ? "/adminchat"
                : "/chat"
            }
            onClick={scrollToTop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#98816a"
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

        <Link
          to={
            appStore.currentUserEmail === "imadmin@gmail.com"
              ? "/admin"
              : "/userpage"
          }
          onClick={scrollToTop}
        >
          {appStore.newUser ? (
            <div>
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={avatarUrl ? avatarUrl : "/bear.jpg"}
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
      {isModalOpen && headerSelectedAdmin && (
        <div className="background-cover" onClick={toggleModal}></div>
      )}
      {isModalOpen && headerSelectedAdmin && (
        <ActivityModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          selectedAdmin={headerSelectedAdmin}
          quantity={quantity}
          setQuantity={setQuantity}
          handleSignUp={handleSignUp}
        />
      )}
    </Navbar>
  );
});

export default Header;
