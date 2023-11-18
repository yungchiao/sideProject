import { observer } from "mobx-react-lite";
import React from "react";
import { appStore } from "../../AppStore";

const UserPage: React.FC = observer(() => {
  return (
    <>
      {appStore.newUser && (
        <div>
          <p>暱稱: {appStore.newUser.name}</p>
          <p>Email: {appStore.newUser.email}</p>
          <img src={appStore.newUser.avatar} alt="Avatar" />
        </div>
      )}
    </>
  );
});

export default UserPage;
