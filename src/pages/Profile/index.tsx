import emailjs from "@emailjs/browser";
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

  const SERVED_ID = "service_um0snro";
  const TEMPLETE_ID = "template_7jpstzp";
  const PUBLIC_KEY = "KGd5mgGXtzBQFKCyN";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
      emailjs.send(
        SERVED_ID,
        TEMPLETE_ID,
        {
          from_name: "Gravity Team 地新引力",
          to_name: name,
          from_email: form.email,
          to_email: email,
          message:
            "歡迎加入地新引力的世界，一起幫助逐漸消逝的傳統文化與精神再度復活，讓我們一起征服宇宙吧！",
          test: "Gravity Team 地新引力",
        },
        PUBLIC_KEY,
      );
      console.log("註冊成功：", user);
    } catch (error) {
      alert("註冊失敗!");
      console.error("註冊失敗：", error);
    }
  };

  return (
    <div className="bg-white pt-28">
      <div className="my-50% flex max-h-screen justify-center ">
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
              <Tab key="login" title="Login">
                <form className="flex flex-col gap-4">
                  <Input
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <Input
                    type="password"
                    label="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <p className="text-center text-small">
                    Need to create an account?{" "}
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      Sign up
                    </Link>
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button fullWidth color="primary" onClick={handleLogin}>
                      Login
                    </Button>
                  </div>
                </form>
              </Tab>
              <Tab key="sign-up" title="Sign up">
                <form className="flex h-[500px] flex-col gap-4">
                  <Input
                    type="name"
                    label="name"
                    value={name}
                    onChange={handleNameChange}
                  />
                  <Input
                    type="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <Input
                    type="password"
                    label="password"
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
                      className="cursor-pointer rounded bg-stone-800 px-4 py-2 font-bold text-white"
                    >
                      選擇頭貼
                    </label>
                    <Button
                      onClick={() =>
                        imageUpload && appStore.uploadImage(imageUpload)
                      }
                    >
                      <p className="mx-auto flex">上傳頭貼</p>
                    </Button>
                  </div>
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      Login
                    </Link>
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      fullWidth
                      color="primary"
                      onClick={() => handleRegister(email, password)}
                    >
                      Sign up
                    </Button>
                  </div>
                </form>
              </Tab>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
});

export default Profile;
