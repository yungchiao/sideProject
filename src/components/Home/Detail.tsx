import { Timestamp } from "firebase/firestore";
import React from "react";
interface Admin {
  id: string;
  name: string;
  place: string;
  price: number;
  images: string;
  hashtags: [];
  startTime: Timestamp;
  endTime: Timestamp;
  content: string;
  isLiked?: boolean;
  latitude: string;
  longitude: string;
}
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
  return (
    <div className="detail-container z-40 mt-4  rounded-md  bg-white p-4">
      <div className="flex gap-8">
        <div className="h-60 w-60 overflow-hidden rounded-md">
          <img src={selectedAdmin.images} className="h-auto w-full" />
        </div>
        <div className="block">
          <h3 className="mb-4 text-2xl font-bold text-yellow-800">
            {selectedAdmin.name}
          </h3>
          <p>{selectedAdmin.startTime?.toDate()?.toLocaleString()}</p>
          <p>{selectedAdmin.endTime?.toDate()?.toLocaleString()}</p>
          <div className="mt-4 flex">
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

            <p>
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
          <div className="mt-4 flex items-center gap-4">
            <p className="">
              活動價格：NT${" "}
              <span className="mb-4 text-2xl font-bold text-yellow-600">
                {selectedAdmin.price}
              </span>{" "}
              元
            </p>
          </div>
        </div>
      </div>
      <div className="my-4 flex gap-4">
        {selectedAdmin.hashtags &&
          Array.isArray(selectedAdmin.hashtags) &&
          selectedAdmin.hashtags.map((hashtag: any, index: any) => (
            <div className="flex h-8 w-auto items-center rounded-full bg-yellow-500 p-2">
              <p key={index} className="text-white">
                # {hashtag}
              </p>
            </div>
          ))}
      </div>
      <p className="max-w-lg rounded-md border p-4 text-sm">
        {selectedAdmin.content}
      </p>
      <div className="mt-4 flex w-full items-center justify-between gap-2">
        <div className=" flex h-10 w-3/4 items-center justify-around rounded-md border">
          <button onClick={() => setQuantity(Math.max(quantity - 1, 0))}>
            -
          </button>
          {quantity}
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <button onClick={handleSignUp} className="rounded-md bg-stone-800 p-2">
          <p className="text-white">確定報名</p>
        </button>
      </div>
    </div>
  );
};

export default Detail;
