import { Input } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { GlobalButton } from "../../components/Button";
interface LocationInputProps {
  onPositionChange: (position: { latitude: number; longitude: number }) => void;
  searchLocation: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  onPositionChange,
  searchLocation,
}) => {
  const [address, setAddress] = useState(searchLocation);

  useEffect(() => {
    setAddress(searchLocation);
  }, [searchLocation]);

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
            key: "AIzaSyD-nDFKTyjJqe6-g6sDtf7npNZ6FzqRiaE",
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
        <GlobalButton
          variant="white"
          content="搜尋地點"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default LocationInput;
