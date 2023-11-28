import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

const LocationInput = () => {
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState({ latitude: null, longitude: null });

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: "AIzaSyD-nDFKTyjJqe6-g6sDtf7npNZ6FzqRiaE",
          },
        },
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      setPosition({ latitude: lat, longitude: lng });
    } catch (error) {
      console.error("Error fetching geocode", error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input value={address} onChange={handleAddressChange} />
        <Button
          onClick={handleSearch}
          className=" border border-stone-800 bg-white"
        >
          搜尋地點
        </Button>
      </div>
      {position.latitude && position.longitude && (
        <div className="mt-2">
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
