import { Button, Card, Input, Link, Tab, Tabs } from "@nextui-org/react";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appStore } from "../../AppStore";

const app = initializeApp(appStore.config);
const db = getFirestore(app);
export const storage = getStorage(app);
const Profile: React.FC = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    if (appStore.currentUserEmail) {
      navigate("/");
    }
  }, [appStore.currentUserEmail, navigate]);

  const [selected, setSelected] = useState("login");
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
    <div className=" h-screen-bg flex pt-20">
      <div className=" w-1/3">
        <img src="/profile.jpg" className="h-full w-full object-cover " />
      </div>
      <div className=" flex w-2/3 items-center justify-center bg-white ">
        <div>
          <Card className=" w-[340px] ">
            <div>
              <Tabs
                fullWidth
                size="md"
                aria-label="Tabs form"
                selectedKey={selected}
                onSelectionChange={(key) => setSelected(String(key))}
                className="mb-4"
              >
                <Tab key="login" title="登入">
                  <form className="flex flex-col gap-4">
                    <Input
                      type="email"
                      label="帳號"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <Input
                      type="password"
                      label="密碼"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <p className="text-center text-small">
                      尚未創建帳號?{" "}
                      <Link size="sm" onPress={() => setSelected("sign-up")}>
                        <p className="cursor-pointer text-green">註冊</p>
                      </Link>
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        fullWidth
                        className="bg-green"
                        onClick={handleLogin}
                      >
                        <p className="text-white">登入</p>
                      </Button>
                    </div>
                  </form>
                </Tab>
                <Tab key="sign-up" title="註冊">
                  <form className="flex flex-col gap-4 ">
                    <Input
                      type="name"
                      label="暱稱"
                      value={name}
                      onChange={handleNameChange}
                    />
                    <Input
                      type="email"
                      label="帳號"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <Input
                      type="password"
                      label="密碼"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <div className="container mx-auto mt-2 flex justify-center gap-4">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageUpload(e.target.files[0]);
                          } else {
                            setImageUpload(null);
                          }
                        }}
                      />

                      <label
                        htmlFor="file-upload"
                        className="fc-today-button hover:bg-darkYellow cursor-pointer rounded-lg bg-yellow px-4 py-2 font-bold text-white"
                      >
                        選擇頭貼
                      </label>
                      <Button
                        className="border-1 border-stone-800 bg-white"
                        onClick={() =>
                          imageUpload && appStore.uploadImage(imageUpload)
                        }
                      >
                        <p className="mx-auto flex text-stone-800">上傳頭貼</p>
                      </Button>
                    </div>
                    <p className="text-center text-small">
                      已經有帳號了嗎?{" "}
                      <Link size="sm" onPress={() => setSelected("login")}>
                        <p className="cursor-pointer text-green">登入</p>
                      </Link>
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        fullWidth
                        className=" bg-green"
                        onClick={() => handleRegister(email, password)}
                      >
                        <p className="text-white">註冊</p>
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default Profile;
