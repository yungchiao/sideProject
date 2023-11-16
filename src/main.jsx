import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Paint from "./pages/Paint";
import Post from "./pages/Post";
import UserPost from "./pages/Post/UserPost";
import Profile from "./pages/Profile";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="profile" element={<Profile />} />
      <Route path="post" element={<Post />} />
      <Route path="userpost" element={<UserPost />} />
      <Route path="paint" element={<Paint />} />
    </Routes>
  </BrowserRouter>,
);
