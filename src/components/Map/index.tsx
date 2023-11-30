import { Button, Input } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

interface LocationInputProps {
  onPositionChange: (position: { latitude: number; longitude: number }) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onPositionChange }) => {
  const [address, setAddress] = useState("");

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: address,
            key: "AIzaSyAWdoz8i2b7xhNwdKtdZ11b67z223yQg_0",
          },
        },
      );

      const { lat, lng } = response.data.results[0].geometry.location;
      onPositionChange({ latitude: lat, longitude: lng });
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
          className="border border-stone-800 bg-white"
        >
          搜尋地點
        </Button>
      </div>
    </div>
  );
};

export default LocationInput;
