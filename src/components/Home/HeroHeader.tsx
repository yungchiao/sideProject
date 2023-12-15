import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { appStore } from "../../AppStore";

const HeroHeader: React.FC = observer(() => {
  const cloudVariants = {
    initial: { x: "100vw" },
    animate: {
      x: 0,
      transition: { type: "spring", stiffness: 20, duration: 4 },
    },
    exit: { x: "100vw", transition: { ease: "easeInOut", duration: 1 } },
  };

  return (
    <div>
      <div className="flex ">
        <div className="flex w-1/2 justify-center pt-24">
          <div className="text-center ">
            <div className="mx-auto mb-12 flex h-auto w-[100px] justify-center">
              <img
                src="/gravity-logo.png"
                className="transition duration-300 ease-in-out hover:rotate-180 hover:scale-150"
              />
            </div>
            <h1 className="mb-10 text-8xl">GRAVITY</h1>
            <h1 className="mb-10 text-4xl">Placemaking Website</h1>
            <div className="flex items-center justify-center gap-2">
              <h1 className="border-r-2 border-stone-800 pr-4 text-3xl font-bold tracking-widest">
                地新引力
              </h1>
              <p className="pl-3 text-lg tracking-widest">地方創生活動網站</p>
            </div>
            {appStore.currentUserEmail ? (
              <div className="none"></div>
            ) : (
              <div className="mt-20">
                <Link color="foreground" to="/profile">
                  <Button className="bg-green text-white">登入</Button>
                </Link>
              </div>
            )}
            <div className="mx-auto mt-20 flex h-[260px] w-full justify-center rounded-md border-2 border-dashed border-stone-400 transition duration-200 hover:scale-105 hover:shadow-lg">
              <div className=" p-8">
                <div className="mb-8 flex gap-3">
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
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                  <p className="text-stone-400">
                    定期更新的地方創生活動等你來發掘！
                  </p>
                </div>
                <div className="mb-8 flex gap-3">
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
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>

                  <p className="text-stone-400">社群功能幫你尋找同好！</p>
                </div>
                <div className="mb-8 flex gap-3">
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>

                  <p className="text-stone-400">
                    分享心得記錄你和這片土地的點點滴滴！
                  </p>
                </div>
                <div className="mb-8 flex gap-3">
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

                  <p className="text-stone-400">接下來就讓我們一起來探索吧！</p>
                </div>
              </div>
            </div>
            <div className=" mt-20 flex justify-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="0.2"
                stroke="currentColor"
                className="h-[200px] w-[200px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="relative  w-2/3  bg-white">
          <img src="/hero-header-cloud.png" className="w-full" />

          <div className="absolute left-0 top-0 z-20 w-full ">
            <motion.img
              src="cloud.png"
              variants={cloudVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default HeroHeader;
