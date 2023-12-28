import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const About: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchAbout();
  }, []);

  return (
    <div className="mt-20 pb-10">
      <div className="relative  h-[48vw] bg-[url('/seeyou.jpg')] bg-cover  bg-fixed  bg-center md:h-[24vw]">
        <div className="absolute bottom-[-1px]  h-[30px] w-full overflow-x-hidden bg-[url('/waving.png')] bg-cover bg-no-repeat "></div>
      </div>
      <div className="relative">
        <div className="mx-auto flex items-center justify-center gap-8">
          <div className="spin-slow absolute top-8 flex h-[180px] w-[180px] justify-center lg:static">
            <img
              src="./gravity-logo.png"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="inline">
            {appStore.aboutInfos.map((about, index) => (
              <div className="block gap-4 pt-60 lg:pt-10 " key={index}>
                <h1 className="mb-8 ml-8 flex w-[2/3] justify-center pt-4 text-3xl font-bold text-brown lg:mx-auto lg:ml-8 lg:justify-start">
                  地新引力的故事
                </h1>
                <div className="flex lg:w-full">
                  <p className="self-start text-6xl text-yellow">「</p>
                  <p className="w-full max-w-[600px] text-sm leading-8">
                    {about.history}
                  </p>
                  <p className="self-end text-6xl text-yellow">」</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {appStore.aboutInfos.map((about, index) => (
          <div key={index} className="mx-auto mt-6 w-3/4 rounded-lg p-4">
            <div className="mb-10 mt-12 flex flex-col justify-center gap-8">
              {about.images.map((image: any, imgIndex: any) => (
                <div
                  key={imgIndex}
                  className={`mt-12 block items-center justify-center gap-24 md:flex ${
                    imgIndex % 2 === 0 ? " flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className="rotate-image flex shadow-md">
                    <img
                      src={image}
                      alt={`Image ${imgIndex}`}
                      className="rotate-30 h-auto w-full transform overflow-hidden rounded-md md:w-[400px]"
                    />
                  </div>
                  <div className=" mb-8 mt-16 flex w-2/3 border-b-2 border-t-2 py-4 md:my-0 md:w-1/3">
                    <p>{about.descriptions[imgIndex]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-24 mt-24 block justify-center gap-20 rounded-lg bg-white py-6 md:flex lg:gap-60">
              <div className="mx-auto flex w-4/5 items-center justify-between md:grid  md:justify-center md:justify-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.8"
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                <p className="my-0 text-3xl font-bold text-green md:my-2">
                  {about.activities}
                </p>
                <p>個活動</p>
              </div>
              <div className="mx-auto flex w-4/5 items-center justify-between md:grid  md:justify-center md:justify-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.8"
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>

                <p className="my-0 text-3xl font-bold text-green md:my-2 ">
                  {about.attendants}
                </p>
                <p>位參加者</p>
              </div>
              <div className="mx-auto flex w-4/5 items-center justify-between md:grid  md:justify-center md:justify-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="0.8"
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="my-0 text-3xl font-bold text-green md:my-2">
                  {about.subsidy}
                </p>
                <p>萬元補助</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default About;
