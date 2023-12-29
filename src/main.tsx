import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./index.css";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import AdminChat from "./pages/Chat/AdminChat";
import Center from "./pages/Directions/Center";
import East from "./pages/Directions/East";
import North from "./pages/Directions/North";
import South from "./pages/Directions/South";
import Paint from "./pages/Paint";
import Post from "./pages/Post";
import UserPost from "./pages/Post/UserPost";
import Profile from "./pages/Profile";
import UserPage from "./pages/UserPage";
const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="profile" element={<Profile />} />
        <Route path="post" element={<Post />} />
        <Route path="userpost" element={<UserPost />} />
        <Route path="paint" element={<Paint />} />
        <Route path="admin" element={<Admin isSidebarOpen={isSidebarOpen} />} />
        <Route path="userpage" element={<UserPage />} />
        <Route path="cart" element={<Cart />} />
        <Route path="chat" element={<Chat />} />
        <Route path="about" element={<About />} />
        <Route path="adminchat" element={<AdminChat />} />
        <Route path="north" element={<North />} />
        <Route path="south" element={<South />} />
        <Route path="east" element={<East />} />
        <Route path="center" element={<Center />} />
      </Routes>
      <Footer />
    </>
  );
};

export default Main;
