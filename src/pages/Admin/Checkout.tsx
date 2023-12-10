import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const About: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchAllUsersData();
  }, []);

  return (
    <div className="mb-40 mt-28">
      {appStore.allUsersCart.map((user, userIndex) => {
        if (!user.checkout || user.checkout.length === 0) {
          return null;
        }

        return (
          <div key={userIndex} className="mx-6 mb-4 rounded-md border p-4">
            <div className="mb-4 flex items-center gap-2">
              <img src={user.avatar} className="h-16 w-16 rounded-full p-1" />
              <h2> {user.name}</h2>
            </div>
            <div>
              {user.checkout.map((item: any, itemIndex: any) => (
                <div key={itemIndex}>
                  <div className="my-3 flex-grow border-t border-gray-200"></div>
                  <p>活動名稱: {item.name}</p>
                  <p>票券數量: {item.quantity}</p>
                  <p>票券價格: NT$ {item.price} 元</p>
                  <p>應付金額: NT$ {item.price * item.quantity} 元</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default About;
