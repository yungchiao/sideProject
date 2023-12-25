import React from "react";
import { Admin } from "../../type";

interface DetailProps {
  selectedAdmin: Admin;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleSignUp: () => void;
}
const getGoogleMapsLink = (latitude: any, longitude: any) => {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};
const Detail: React.FC<DetailProps> = ({
  selectedAdmin,
  quantity,
  setQuantity,
  handleSignUp,
}) => {
  const modifiedHandleSignUp = () => {
    handleSignUp();
    setQuantity(0);
  };
  return (
    <div className="relative z-40 mt-4 flex  gap-8 rounded-md   bg-white lg:flex-col">
      <div className="absolute left-1/2 top-[-40px] h-8 w-1/3 min-w-[140px] -translate-x-1/2 transform rounded-full border-2 bg-white shadow-md md:top-[-50px] md:h-12">
        <div className=" flex items-center justify-center pt-1 text-base font-bold text-brown md:py-2 md:text-xl md:tracking-widest">
          詳細資訊
        </div>
      </div>
      <div className="mx-[20px] mb-4 flex  max-h-[600px] flex-col justify-center gap-8 overflow-auto pt-6  md:flex-row">
        <div className="w-full pt-0 sm:pt-40 md:w-2/3 md:pt-0 ">
          <div className="mb-5  w-full overflow-hidden rounded-md md:mt-0 md:h-52 lg:h-60 ">
            <img
              src={selectedAdmin.images}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="block">
            <h3 className="mb-4  text-xl font-bold text-brown">
              {selectedAdmin.name}
            </h3>
            <p>{selectedAdmin.startTime?.toDate()?.toLocaleString()}</p>
            <p>{selectedAdmin.endTime?.toDate()?.toLocaleString()}</p>
            <div className="mt-4 inline-block transition duration-200 hover:text-darkBrown">
              <div className="flex">
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
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>

                <p className="text-brown">
                  {selectedAdmin.latitude && selectedAdmin.longitude ? (
                    <a
                      href={getGoogleMapsLink(
                        selectedAdmin.latitude,
                        selectedAdmin.longitude,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedAdmin.place}
                    </a>
                  ) : (
                    <span>{selectedAdmin.place}</span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <p className="">
                活動價格：NT$
                <span className="mb-4 text-2xl font-bold text-brown">
                  {selectedAdmin.price}
                </span>
                元
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full content-between md:w-full">
          <div>
            <p className="mb-4 h-52 w-full overflow-auto rounded-md border p-4 text-sm leading-8 lg:h-[240px]">
              {selectedAdmin.content}
            </p>
            <div className="my-4 block gap-4 md:flex ">
              {selectedAdmin.hashtags &&
                Array.isArray(selectedAdmin.hashtags) &&
                selectedAdmin.hashtags.map((hashtag: string, index: number) => (
                  <div className="hashtag mb-2 inline-flex h-8  items-center rounded-full p-4">
                    <p key={index} className="whitespace-nowrap text-stone-800">
                      # {hashtag}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-4 block w-full items-center justify-between md:flex ">
            <div className="mb-4 flex w-auto flex-none justify-center md:mb-0 ">
              <p className="mr-2 whitespace-nowrap">請選擇人數：</p>
            </div>
            <div className="flex grow gap-2">
              <div className="flex w-full items-center justify-center">
                <div className=" flex h-10 w-full items-center justify-around rounded-md border">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 0))}
                  >
                    -
                  </button>
                  {quantity}
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <div>
                <button
                  onClick={modifiedHandleSignUp}
                  className="rounded-md bg-brown p-2"
                >
                  <p className="whitespace-nowrap text-white">確定報名</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
