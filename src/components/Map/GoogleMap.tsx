import { doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
  latitude: string;
  longitude: string;
}

const GoogleMap: React.FC = observer(() => {
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (appStore.currentUserEmail) {
        const userRef = doc(appStore.db, "user", appStore.currentUserEmail);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.checkout) {
              setCheckoutItems(userData.checkout);
            }
          }
        } catch (error) {
          console.error("讀取訂單資料失敗", error);
        }
      }
    };

    fetchCheckoutData();
  }, [appStore.currentUserEmail]);

  const initMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
      center: { lat: 23.97565, lng: 120.9738819 },
      zoom: 7,
    });
    const userAvatarUrl = appStore.newUser?.avatar || "/bear.jpg";
    const iconSize = new google.maps.Size(30, 30);
    checkoutItems.forEach((checkout) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          parseFloat(checkout.latitude),
          parseFloat(checkout.longitude),
        ),
        map: map,
        icon: {
          url: userAvatarUrl,
          scaledSize: iconSize,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<p>${checkout.name}</p>`,
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
  }, [checkoutItems]);

  return (
    <div className="tranition mx-auto flex w-1/3 overflow-hidden rounded-2xl duration-300 hover:scale-105">
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px",
          display: "flex",
          margin: "auto",
        }}
      />
    </div>
  );
});
declare global {
  interface Window {
    initMap: () => void;
  }
}
export default GoogleMap;
