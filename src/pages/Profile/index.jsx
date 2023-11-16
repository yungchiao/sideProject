import { Input } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/firestore";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
const firebaseConfig = {
  apiKey: "AIzaSyA69gAsOHrnfSdhKmKQniLUVExD9Kz8QK0",
  authDomain: "gravity-fd062.firebaseapp.com",
  projectId: "gravity-fd062",
  storageBucket: "gravity-fd062.appspot.com",
  messagingSenderId: "835366327544",
  appId: "1:835366327544:web:6b68f2b9e5101c5eb2d70d",
  measurementId: "G-X55F254YTP",
};

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function Profile() {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const addUser = async (uid) => {
    const docRef = doc(collection(db, "user"), email);

    const newUser = {
      email: email,
      following: [],
      id: uid,
      name: name,
    };

    await setDoc(docRef, newUser);
  };

  const handleLogin = () => {
    if (email && password) {
      const docRef = doc(collection(db, "user"), email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("登入成功：", user);
          // addUser(email, name, docRef);
        })
        .catch((error) => {
          console.error("登入失敗：", error);
        });
    }
  };

  const handleRegister = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        addUser(user.uid);

        console.log("註冊成功：", user);
      })
      .catch((error) => {
        console.log("註冊失敗QQ");
      });
  };
  return (
    <>
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
      <ButtonContainer>
        <Button onClick={handleLogin}>
          <ButtonA>登入</ButtonA>
        </Button>
        <Button onClick={() => handleRegister(email, password)}>
          <ButtonA>註冊</ButtonA>
        </Button>
      </ButtonContainer>
      <div className="mt-4 text-center">
        <DatePicker
          className="cursor-pointer bg-yellow-500 text-center text-blue-500"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
    </>
  );
}

export default Profile;
