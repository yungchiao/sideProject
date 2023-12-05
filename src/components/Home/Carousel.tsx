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
    <div className=" flex h-auto w-3/4 cursor-pointer justify-center">
      <Link to={imageRoutes[localImages[activeCampaignIndex]]}>
        {" "}
        <img src={localImages[activeCampaignIndex]} alt="Campaign Image" />
      </Link>
    </div>
  );
};

export default Carousal;
