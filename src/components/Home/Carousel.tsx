import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Carousal: React.FC = () => {
  const localImages = ["/north.png", "/center.png", "/south.png", "/east.png"];
  const imageRoutes: { [key: string]: string } = {
    "/north.png": "/north",
    "/center.png": "/center",
    "/south.png": "/south",
    "/east.png": "/east",
  };
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const handlePrev = () => {
    setActiveCampaignIndex((prev) =>
      prev === 0 ? localImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveCampaignIndex((prev) =>
      prev === localImages.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setActiveCampaignIndex((prev) =>
        prev === localImages.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className=" flex h-auto w-full cursor-pointer items-center justify-between gap-6">
      <button className="" onClick={handlePrev}>
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
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      <Link to={imageRoutes[localImages[activeCampaignIndex]]}>
        {localImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Campaign Image"
            className={`w-full object-cover transition-transform duration-500 ease-in-out ${
              index === activeCampaignIndex ? "slide-in" : "slide-out"
            }`}
            style={{
              display: index === activeCampaignIndex ? "block" : "none",
            }}
          />
        ))}
      </Link>
      <button className="" onClick={handleNext}>
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
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default Carousal;
