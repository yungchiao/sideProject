import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "./AppStore";
import Home from "./components/Home";
import Calendar from "./pages/Calendar";
const App: React.FC = observer(() => {
  useEffect(() => {
    const userId = appStore.currentUserEmail;

    if (userId) {
      appStore.fetchUserData(userId);
    }
  }, [appStore.currentUserEmail]);
  return (
    <>
      <Home />
      <Calendar />
    </>
  );
});

export default App;
