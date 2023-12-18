import { observer } from "mobx-react-lite";
const Footer: React.FC = observer(() => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="relative w-full shadow-inner">
      <div className="absolute left-0 top-0 h-full w-full bg-white opacity-50"></div>
      <div className="relative flex h-[770px] w-full items-center justify-center bg-[url('/footer.jpeg')] bg-cover bg-scroll bg-no-repeat">
        <div className=" text-center">
          <div className="mx-auto mb-10 w-[100px]">
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
          <div className="mt-12 flex justify-center gap-6">
            <a
              href="https://www.facebook.com/?locale=zh_TW"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 px-4 py-2 transition duration-200 hover:scale-105 hover:border-stone-500 hover:text-stone-400 hover:shadow-md">
                Facebook
              </div>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 px-4 py-2 shadow-md transition duration-200 hover:scale-105 hover:border-stone-500 hover:text-stone-400">
                Instagram
              </div>
            </a>
            <a
              href="mailto:jolina4526@mail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cursor-pointer rounded-full border border-stone-800 px-4 py-2 shadow-md transition duration-200 hover:scale-105 hover:border-stone-500 hover:text-stone-400">
                E-mail
              </div>
            </a>
          </div>
          <p className="mt-12">
            Copyright © 2023 Gravity All Rights Reserved.
          </p>
        </div>
      </div>
      <div
        className=" absolute bottom-20 right-20 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-green shadow-lg transition duration-200 hover:scale-105 hover:bg-darkGreen"
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
