import { observer } from "mobx-react-lite";
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { appStore } from "./AppStore";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import "./index.css";
const About = lazy(() => import("./pages/About"));
const Admin = lazy(() => import("./pages/Admin"));
const Chat = lazy(() => import("./pages/Chat"));
const AdminChat = lazy(() => import("./pages/Chat/AdminChat"));
const Center = lazy(() => import("./pages/Directions/Center"));
const East = lazy(() => import("./pages/Directions/East"));
const North = lazy(() => import("./pages/Directions/North"));
const South = lazy(() => import("./pages/Directions/South"));
const Paint = lazy(() => import("./pages/Paint"));
const Post = lazy(() => import("./pages/Post"));
const UserPost = lazy(() => import("./pages/Post/UserPost"));
const Profile = lazy(() => import("./pages/Profile"));
const UserPage = lazy(() => import("./pages/UserPage"));

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

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1280);
  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 1280);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarAndOverlay = () => {
    toggleSidebar();
    setIsOverlayVisible(!isOverlayVisible);
  };

  const handleSidebarClick = (event: any) => {
    if (!event.target.closest(".search-client")) {
      toggleSidebarAndOverlay();
    }
  };
  const handleClick = (event: any) => {
    if (!isLargeScreen) {
      toggleSidebarAndOverlay();
      handleSidebarClick(event);
    }
  };
  return (
    <>
      <Header
        toggleSidebarAndOverlay={toggleSidebarAndOverlay}
        isOverlayVisible={isOverlayVisible}
        isLargeScreen={isLargeScreen}
      />
      <Suspense fallback={"loading"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post" element={<Post />} />
          <Route path="userpost" element={<UserPost />} />
          <Route path="paint" element={<Paint />} />
          <Route
            path="admin"
            element={
              <Admin
                isSidebarOpen={isSidebarOpen}
                toggleSidebarAndOverlay={toggleSidebarAndOverlay}
                isLargeScreen={isLargeScreen}
              />
            }
          />
          <Route path="userpage" element={<UserPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="chat" element={<Chat />} />
          <Route path="about" element={<About />} />
          <Route
            path="adminchat"
            element={
              <AdminChat
                toggleSidebarAndOverlay={toggleSidebarAndOverlay}
                isSidebarOpen={isSidebarOpen}
                isLargeScreen={isLargeScreen}
                handleClick={(event: any) => handleClick(event)}
              />
            }
          />
          <Route path="north" element={<North />} />
          <Route path="south" element={<South />} />
          <Route path="east" element={<East />} />
          <Route path="center" element={<Center />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
});

export default App;
