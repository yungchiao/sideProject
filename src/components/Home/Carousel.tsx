import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Carousal: React.FC = () => {
  const localImages = ["/north.png", "/center.png", "/south.png", "/east.png"];
  const [slideDirection, setSlideDirection] = useState("right");
  const imageRoutes: { [key: string]: string } = {
    "/north.png": "/north",
    "/center.png": "/center",
    "/south.png": "/south",
    "/east.png": "/east",
  };
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const handlePrev = () => {
    setSlideDirection("left");
    setActiveCampaignIndex((prev) =>
      prev === 0 ? localImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setSlideDirection("right");
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
    <div>
      <div className=" carousel-container flex h-auto w-full cursor-pointer items-center justify-between gap-20 ">
        <button className="h-auto w-[250px]" onClick={handlePrev}>
          <img src="/left.png" className="h-full w-full" />
        </button>
        <Link to={imageRoutes[localImages[activeCampaignIndex]]}>
          {localImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Campaign Image"
              className={`carousel-image ${
                index === activeCampaignIndex
                  ? slideDirection === "right"
                    ? "slide-in-left"
                    : "slide-in-right"
                  : "slide-out"
              }`}
              style={{
                display: index === activeCampaignIndex ? "block" : "none",
              }}
            />
          ))}
        </Link>
        <button className=" h-auto w-[250px]" onClick={handleNext}>
          <img src="/right.png" className=" h-full w-full" />
        </button>
      </div>
    </div>
  );
};

export default Carousal;
