import { Card, CardBody } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { Admin } from "../../type";

interface ActivityCardProps {
  handleIconClick: (admin: Admin) => void;
  getGoogleMapsLink: (latitude: string, longitude: string) => string;
  handleAdminClick: (admin: any) => void;
  admin: Admin;
}
const ActivityCard: React.FC<ActivityCardProps> = observer(
  ({ admin, handleAdminClick, handleIconClick, getGoogleMapsLink }) => {
    return (
      <div className="relative">
        <Card
          key={admin.id}
          className="relative mx-auto w-full rounded-lg border bg-white p-4 transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          <CardBody className="flex overflow-visible p-0">
            <div className="absolute left-1/2 top-[-95px] -translate-x-1/2 transform">
              <div className="mx-auto flex h-[400px] w-[400px] justify-center overflow-hidden rounded-full">
                <img
                  src={admin.images}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className=" mt-[330px]  flex justify-center">
              <h3
                onClick={() => handleAdminClick(admin)}
                className="inline-block cursor-pointer text-lg font-bold text-brown"
              >
                {admin.name}
              </h3>
            </div>
            <br />
            <p className=" flex justify-center">
              {admin.startTime?.toDate()?.toLocaleString()}{" "}
            </p>
            <p className="my-1 flex justify-center">|</p>
            <p className="mb-4 flex justify-center">
              {admin.endTime?.toDate()?.toLocaleString()}{" "}
            </p>
            <div className="mx-4 my-2 flex w-auto justify-center rounded-full border-2 p-2">
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
              <p className="flex justify-center text-center font-bold text-brown">
                {admin.latitude && admin.longitude ? (
                  <a
                    href={getGoogleMapsLink(admin.latitude, admin.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {admin.place}
                  </a>
                ) : (
                  <span>{admin.place}</span>
                )}
              </p>
            </div>
            <div className="my-4 flex justify-center">
              <p>
                活動費用：NT${" "}
                <span className="text-xl font-bold text-green">
                  {admin.price}
                </span>{" "}
                元
              </p>
            </div>{" "}
            <div className=" mx-auto mb-4 mt-2 flex w-full justify-center gap-2 overflow-x-auto">
              {admin.hashtags &&
                Array.isArray(admin.hashtags) &&
                admin.hashtags.map((hashtag: string, index: number) => (
                  <div className="hashtag flex h-8 w-auto items-center  rounded-full p-2">
                    <p
                      key={index}
                      className="whitespace-nowrap  text-sm text-stone-800"
                    >
                      #{hashtag}
                    </p>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
        <div className="absolute  right-[-12px] top-[-12px] flex  h-12 w-12 rounded-full  bg-yellow ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth={admin.isLiked ? "0" : "0.8"}
            stroke="white"
            className=" bottom-0 right-0 h-8 w-8 translate-x-1/4 translate-y-1/3 transform cursor-pointer"
            fill={admin.isLiked ? "#98816a" : "#dac040"}
            onClick={() => handleIconClick(admin)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
      </div>
    );
  },
);

export default ActivityCard;
