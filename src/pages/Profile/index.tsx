import { Button, Input } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { appStore } from "../../AppStore";

const app = initializeApp(appStore.config);
const db = getFirestore(app);
export const storage = getStorage(app);
const Profile: React.FC = observer(() => {
  const auth = getAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleLogin = () => {
    if (email && password) {
      const docRef = doc(collection(db, "user"), email);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("登入成功!");
          console.log("登入成功：", user);
        })
        .catch((error) => {
          alert("登入失敗!");
          console.error("登入失敗：", error);
        });
    }
  };

  const handleRegister = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (imageUpload) {
        await appStore.addUser(user.uid, email, name, imageUpload);
      } else {
        await appStore.addUser(user.uid, email, name, new File([], ""));
      }
      alert("註冊成功!");
      console.log("註冊成功：", user);
    } catch (error) {
      alert("註冊失敗!");
      console.error("註冊失敗：", error);
    }
  };

  return (
    <div className="mt-28">
      <p className="mr-2">暱稱</p>
      <div className="ml-10 mr-10 flex w-80 flex-wrap gap-4 md:flex-nowrap">
        <Input
          type="name"
          label="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <p className="mr-2">帳號</p>
      <div className="ml-10 mr-10 flex w-80 flex-wrap gap-4 md:flex-nowrap">
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <p className="mr-2">密碼</p>
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
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImageUpload(e.target.files[0]);
          } else {
            setImageUpload(null);
          }
        }}
      />

      <Button onClick={() => imageUpload && appStore.uploadImage(imageUpload)}>
        <p className="mx-auto flex">上傳頭貼</p>
      </Button>

      <div className="flex justify-center gap-20">
        <Button onClick={handleLogin}>
          <p className="mx-auto flex">登入</p>
        </Button>
        <Button onClick={() => handleRegister(email, password)}>
          <p className="mx-auto flex">註冊</p>
        </Button>
        <Button onClick={appStore.logout}>
          <p className="mx-auto flex">登出</p>
        </Button>
      </div>
    </div>
  );
});

export default Profile;
