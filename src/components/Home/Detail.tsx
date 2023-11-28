import { Timestamp } from "firebase/firestore";
import React from "react";
interface Admin {
  id: string;
  name: string;
  position: string;
  price: number;
  images: string;
  hashtags: [];
  startTime: Timestamp;
  endTime: Timestamp;
  content: string;
  isLiked?: boolean;
}
interface DetailProps {
  selectedAdmin: Admin;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleSignUp: () => void;
}

const Detail: React.FC<DetailProps> = ({
  selectedAdmin,
  quantity,
  setQuantity,
  handleSignUp,
}) => {
  return (
    <div className="detail-container z-40  mt-4 w-1/3 rounded-md  p-4">
      <h3>{selectedAdmin.name}</h3>
      <p>{selectedAdmin.startTime?.toDate()?.toLocaleString()}</p>
      <p>{selectedAdmin.endTime?.toDate()?.toLocaleString()}</p>
      <p>{selectedAdmin.position}</p>
      <p>{selectedAdmin.price}</p>
      <img src={selectedAdmin.images} className="h-auto w-60" />
      {selectedAdmin.hashtags &&
        Array.isArray(selectedAdmin.hashtags) &&
        selectedAdmin.hashtags.map((hashtag: any, index: any) => (
          <p key={index}>#{hashtag}</p>
        ))}
      <p>{selectedAdmin.content}</p>
      <button onClick={() => setQuantity(Math.max(quantity - 1, 0))}>-</button>
      {quantity}
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
      <button onClick={handleSignUp}>確定報名</button>
    </div>
  );
};

export default Detail;
