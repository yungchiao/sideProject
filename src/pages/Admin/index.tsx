import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
import Activity from "./Activity";
import AdminAbout from "./AdminAbout";
import Checkout from "./Checkout";
export const storage = getStorage(appStore.app);
interface AdminProps {
  isSidebarOpen: boolean;
  isLargeScreen: boolean;
  toggleSidebarAndOverlay: () => void;
}
const Admin: React.FC<AdminProps> = observer(
  ({ isSidebarOpen, toggleSidebarAndOverlay, isLargeScreen }) => {
    const [activeTab, setActiveTab] = useState("activity");

    const handleTabChange = (tabKey: any) => {
      setActiveTab(tabKey);
    };

    return (
      <>
        {appStore.currentUserEmail === "imadmin@gmail.com" ? (
          <>
            <div className="flex justify-between overflow-hidden ">
              <div
                className={`navigation-menu fixed top-0  z-50 h-full w-[200px] bg-stone-300 transition-transform  duration-300 lg:w-1/5 xl:z-10 xl:w-2/12 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } xl:relative xl:translate-x-0`}
                onClick={!isLargeScreen ? toggleSidebarAndOverlay : undefined}
              >
                <div>
                  <div className=" grid h-[100vh] w-full content-between  justify-center bg-stone-300 px-5 pt-10 xl:h-[1380px] xl:pt-28">
                    <div>
                      <button
                        className={`mt-2 h-10 w-full  border-b-2 border-neutral-100 ${
                          activeTab === "activity" ? "text-brown" : ""
                        } `}
                        onClick={() => {
                          handleTabChange("activity");
                          !isLargeScreen ? toggleSidebarAndOverlay : undefined;
                        }}
                      >
                        活動管理
                      </button>
                      <button
                        className={`mt-2 h-10 w-full  border-b-2 border-neutral-100 ${
                          activeTab === "checkout" ? "text-brown" : ""
                        } `}
                        onClick={() => {
                          handleTabChange("checkout");
                          !isLargeScreen ? toggleSidebarAndOverlay : undefined;
                        }}
                      >
                        訂單總覽
                      </button>
                      <button
                        className={`mt-2 h-10 w-full  border-b-2 border-neutral-100 ${
                          activeTab === "about" ? "text-brown" : ""
                        } `}
                        onClick={() => {
                          handleTabChange("about");
                          !isLargeScreen ? toggleSidebarAndOverlay : undefined;
                        }}
                      >
                        團隊資訊
                      </button>
                    </div>
                    <div>
                      <div className="my-10  flex  justify-center">
                        <button
                          className="mt-2 h-10 w-full  border-b-2 border-neutral-100 pb-8 "
                          onClick={appStore.logout}
                        >
                          <p className="text-stone-800 hover:text-brown">
                            登出
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full xl:w-10/12">
                {activeTab === "activity" && <Activity />}
                {activeTab === "checkout" && <Checkout />}
                {activeTab === "about" && <AdminAbout />}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-screen w-full items-center justify-center text-center">
            <div className=" rounded-md border px-10 py-6 md:px-40">
              <p className="text:xl md:text-3xl">
                只有 <span className="text-green">Admin</span>{" "}
                身份可進入此頁面。
              </p>
              <div className="mt-4 flex justify-center">
                <GlobalButton
                  variant="gray"
                  content="以Admin身份登入"
                  to="/profile"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
);

export default Admin;
