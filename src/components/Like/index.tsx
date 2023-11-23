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
      const newCartItems = likeItems.filter((_, index) => index !== itemIndex);
      setLikeItems(newCartItems);

      appStore.deleteFromLike(appStore.currentUserEmail, itemToDelete.id);
      window.alert("取消收藏");
    }
  }
  return (
    <div className="mx-auto mt-4 w-3/4  rounded-lg p-4">
      {likeItems.map((item, index) => (
        <div
          key={index}
          className="mb-4 flex items-center justify-between rounded-md border p-4"
        >
          <p>{item.name}</p>
          <p>{item.position}</p>
          <p>{item.startTime?.toDate()?.toLocaleString()}</p>
          <p>-</p>
          <p>{item.endTime?.toDate()?.toLocaleString()}</p>
          <img src={item.images} className="h-16 w-16" />
          <button onClick={() => deleteItem(index)}>
            <div className="h-8 w-8 cursor-pointer bg-[url('/trash.png')] bg-contain" />
          </button>
        </div>
      ))}
    </div>
  );
});
export default Like;
