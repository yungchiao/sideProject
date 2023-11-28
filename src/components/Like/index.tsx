import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
interface LikeItem {
  id: string;
  name: string;
  images: string;
  position: string;
  price: number;
  startTime: Timestamp;
  endTime: Timestamp;
}
const Like: React.FC = observer(() => {
  const [likeItems, setLikeItems] = useState<LikeItem[]>([]);
  useEffect(() => {
    const fetchLikeData = async () => {
      const userId = appStore.currentUserEmail;
      if (userId) {
        const likeData = await appStore.fetchLike(userId);
        setLikeItems(likeData);
      }
    };

    fetchLikeData();
  }, [appStore.currentUserEmail]);

  function deleteItem(itemIndex: any) {
    const itemToDelete = likeItems[itemIndex];

    if (itemToDelete && appStore.currentUserEmail) {
      const newLikeItems = likeItems.filter((_, index) => index !== itemIndex);
      setLikeItems(newLikeItems);

      appStore.deleteFromLike(appStore.currentUserEmail, itemToDelete.id);
      window.alert("取消收藏");
    }
  }
  return (
    <div className="mx-auto mt-4 w-4/5  rounded-lg p-4">
      {likeItems.map((item, index) => (
        <div
          key={index}
          className="mb-4 flex items-center justify-between rounded-md border p-4"
        >
          <p>{item.name}</p>
          <p>{item.position}</p>
          <p>
            {item.startTime?.toDate()?.toLocaleString()}-
            {item.endTime?.toDate()?.toLocaleString()}
          </p>
          <img src={item.images} className="h-16 w-16" />
          <button onClick={() => deleteItem(index)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="0.8"
              stroke="currentColor"
              className=" h-8 w-8 cursor-pointer"
              fill="red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
});
export default Like;
