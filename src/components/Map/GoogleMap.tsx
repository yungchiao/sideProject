import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
interface CartItem {
  name: string;
  quantity: number;
  price: number;
  id: string;
  latitude: string;
  longitude: string;
}

const GoogleMap: React.FC = observer(() => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const fetchCartData = async () => {
      const userId = appStore.currentUserEmail;
      if (userId) {
        const cartData = await appStore.fetchCart(userId);
        setCartItems(cartData);
      }
    };

    fetchCartData();
  }, [appStore.currentUserEmail]);

  const initMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      center: { lat: 23.97565, lng: 120.9738819 },
      zoom: 7,
    });
    const customIconUrl = "/footprints.png";
    const iconSize = new google.maps.Size(40, 40);
    cartItems.forEach((cart) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat(cart.latitude),
          parseFloat(cart.longitude),
        ),
        map: map,
        icon: {
          url: customIconUrl,
          scaledSize: iconSize,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<p>${cart.name}</p>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  };

  useEffect(() => {
    const loadGoogleMapScript = () => {
      if (window.google) {
        initMap();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAWdoz8i2b7xhNwdKtdZ11b67z223yQg_0&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMapScript();
  }, [cartItems]);

  return (
    <div
      id="map"
      style={{
        width: "73%",
        height: "400px",
        display: "flex",
        margin: "auto",
      }}
    />
  );
});
declare global {
  interface Window {
    initMap: () => void;
  }
}
export default GoogleMap;
