import { doc, getDoc } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import { CheckoutItem } from "../../type";
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
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

  const initMap = async () => {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    // 1. 建立地圖（需載入 mapId，AdvancedMarkerElement 需要地圖 ID 才能運作）
    const map = new window.google.maps.Map(mapElement, {
      center: { lat: 23.97565, lng: 120.9738819 },
      zoom: 7,
      mapId: "DEMO_MAP_ID", // 測試時可先使用 Google 官方預設的 DEMO_MAP_ID
    });

    // 2. 引入 AdvancedMarkerElement 庫
    const { AdvancedMarkerElement } = (await window.google.maps.importLibrary(
      "marker",
    )) as any;

    const userAvatarUrl = appStore.newUser?.avatar || "/bear.jpg";
    checkoutItems.forEach((checkout) => {
      // 建立自訂頭像 HTML 元素作為 Marker 的內容
      const img = document.createElement("img");
      img.src = userAvatarUrl;
      img.style.width = "30px";
      img.style.height = "30px";
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";

      // 3. 使用新版的 AdvancedMarkerElement
      const marker = new AdvancedMarkerElement({
        position: {
          lat: parseFloat(checkout.latitude),
          lng: parseFloat(checkout.longitude),
        },
        map: map,
        title: checkout.name,
        content: img, // 帶入自訂的頭像 HTML 元素
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<p>${checkout.name}</p>`,
      });

      // 新版 Marker 監聽點擊事件的寫法
      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
        });
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
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      script.src =
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=TW&language=zh-TW`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMapScript();
  }, [checkoutItems]);

  return (
    <div className="tranition mx-auto flex w-4/5 overflow-hidden rounded-2xl duration-300 hover:scale-105 md:w-1/2">
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
