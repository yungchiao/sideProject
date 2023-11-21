import { Input, avatar } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/firestore";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import styled from "styled-components";
import { appStore } from "../../AppStore";

const Title = styled.p`
  margin-right: 10px;
`;
const Button = styled.button`
  display: flex;
  margin-top: 10px;
  cursor: pointer;
  background-color: black;
  color: #fff;
  border: none;
  width: 80px;
  height: 30px;
  padding: auto auto;
  border-radius: 6px;
`;
const ButtonA = styled.p`
  margin: auto auto;
`;
const ButtonContainer = styled.div`
  justify-content: center;
  gap: 20px;
  display: flex;
`;
const app = initializeApp(appStore.config);
const db = getFirestore(app);
export const storage = getStorage(app);
const Profile = observer(() => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleLogin = () => {
    if (email && password) {
      const docRef = doc(collection(db, "user"), email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("登入成功：", user);
        })
        .catch((error) => {
          console.error("登入失敗：", error);
        });
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const imageUrl = await uploadImage();

      appStore.addUser(user.uid, email, name, imageUrl);

      console.log("注冊成功：", user);
    } catch (error) {
      console.log("注冊失敗：", error);
    }
  };
  return (
    <div className="mt-28">
      <Title>暱稱</Title>
      <div className="ml-10 mr-10 flex w-80 flex-wrap gap-4 md:flex-nowrap">
        <Input
          type="name"
          label="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <Title>帳號</Title>
      <div className="ml-10 mr-10 flex w-80 flex-wrap gap-4 md:flex-nowrap">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <Title>密碼</Title>
      <div className="ml-10 mr-10 flex w-80 flex-wrap gap-4 md:flex-nowrap">
        <Input
          type="password"
          label="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <input
        type="file"
        className="mb-4 "
        onChange={(e) => {
          setImageUpload(e.target.files[0]);
        }}
      ></input>
      <Button onClick={() => appStore.uploadImage(avatar)}>
        <ButtonA>上傳頭貼</ButtonA>
      </Button>
      <ButtonContainer>
        <Button onClick={handleLogin}>
          <ButtonA>登入</ButtonA>
        </Button>
        <Button onClick={() => handleRegister(email, password)}>
          <ButtonA>註冊</ButtonA>
        </Button>
        <Button onClick={appStore.logout}>
          <ButtonA>登出</ButtonA>
        </Button>
      </ButtonContainer>
    </div>
  );
});

export default Profile;
