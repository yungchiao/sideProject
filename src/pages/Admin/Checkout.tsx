import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const About: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchAllUsersData();
  }, []);
  const hasCheckoutData = appStore.allUsersCart.some(
    (user) => user.checkout && user.checkout.length > 0,
  );
  return (
    <>
      {hasCheckoutData ? (
        <div className="mx-4 flex justify-center pb-4 pt-28">
          <div className="mx-auto  h-[1100px] w-full overflow-auto rounded-lg border bg-white p-6">
            {appStore.allUsersCart.map((user, userIndex) => {
              if (!user.checkout || user.checkout.length === 0) {
                return null;
              }

              return (
                <div key={userIndex} className=" mb-4 rounded-md border p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <img
                      src={user.avatar}
                      className="rounded-full p-1 sm:h-10 sm:w-10 md:h-16 md:w-16"
                    />
                    <h2> {user.email}</h2>
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
        </div>
      ) : (
        <div className="  mx-auto   flex items-center justify-center   text-center">
          <div className="block rounded-md border px-40 py-6">
            <h1 className="mb-4 text-3xl">目前訂單資料為空</h1>
          </div>
        </div>
      )}
    </>
  );
});

export default About;
