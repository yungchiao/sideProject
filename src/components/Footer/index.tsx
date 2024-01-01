import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
const Footer: React.FC = observer(() => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const location = useLocation();
  const hideFooterOn = [
    "/chat",
    "/adminchat",
    "/profile",
    "/admin",
    "/userpost",
  ];
  if (hideFooterOn.includes(location.pathname)) {
    return null;
  }
  return (
    <div className="relative  w-full shadow-inner">
      <div className="absolute left-0 top-0 h-full w-full bg-white opacity-50"></div>
      <div className="relative flex h-[770px] w-full items-center justify-center bg-[url('/footer.jpeg')] bg-cover bg-scroll bg-no-repeat">
        <div className=" text-center">
          <div className="mx-auto mb-12 flex h-auto justify-center sm:w-[80px] md:w-[100px]">
            <img
              src="/gravity-logo.png"
              className="transition duration-300 ease-in-out hover:rotate-180 hover:scale-150"
            />
          </div>
          <h1 className="sm:mb-6 sm:text-5xl md:mb-10 md:text-8xl">GRAVITY</h1>
          <h1 className="sm:mb-6 sm:text-xl md:mb-12 md:text-4xl">
            Placemaking Website
          </h1>
          <div className="flex items-center justify-center gap-2">
            <h1 className="border-r-2 border-stone-800 pr-4 font-bold tracking-widest sm:text-lg md:text-3xl">
              地新引力
            </h1>
            <p className="pl-3 text-lg tracking-widest">地方創生活動網站</p>
          </div>
          <div className="mt-12 flex justify-center gap-6 sm:flex-col sm:px-20 md:flex-row">
            <a
              href="https://www.facebook.com/?locale=zh_TW"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 bg-white/50 px-4 py-2 transition duration-200 hover:scale-105 hover:border-none hover:bg-brown hover:text-white hover:shadow-md">
                Facebook
              </div>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 bg-white/50 px-4 py-2 shadow-md transition duration-200 hover:scale-105 hover:border-none hover:bg-brown hover:text-white">
                Instagram
              </div>
            </a>
            <a
              href="mailto:gravity.placemaker2023@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 bg-white/50 px-4 py-2 shadow-md transition duration-200 hover:scale-105 hover:border-none hover:bg-brown hover:text-white">
                E-mail
              </div>
            </a>
          </div>
          <p className="sm:mt-6 sm:text-sm md:mt-12">
            Copyright © 2023 Gravity All Rights Reserved.
          </p>
        </div>
      </div>
      <div
        className=" absolute flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-green shadow-lg transition duration-200 hover:scale-105 hover:bg-darkGreen sm:bottom-10 sm:right-10 md:bottom-20 md:right-20"
        onClick={scrollToTop}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="white"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
          />
        </svg>
      </div>
    </div>
  );
});

export default Footer;
