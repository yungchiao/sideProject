import { observer } from "mobx-react-lite";
import React, { useEffect, useLayoutEffect } from "react";
import { appStore } from "./AppStore";
import Home from "./components/Home";
import "./index.css";
const App: React.FC = observer(() => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
    }
  }, [appStore.currentUserEmail]);
  return (
    <>
      <Home />
    </>
  );
});

export default App;
