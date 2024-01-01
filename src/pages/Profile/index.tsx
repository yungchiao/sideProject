import { Card, Input, Link } from "@nextui-org/react";
import { FirebaseError, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
const app = initializeApp(appStore.config);
export const storage = getStorage(app);
const Profile: React.FC = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    if (appStore.currentUserEmail) {
      navigate("/");
    }
  }, [appStore.currentUserEmail, navigate]);
  const [selected, setSelected] = useState("login");
  const [activeTab, setActiveTab] = useState("login");
  const auth = getAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
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
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("登入成功!");
          console.log("登入成功：", user);
        })
        .catch((error) => {
          toast.error("登入失敗!");
          console.error("登入失敗：", error);
        });
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newImageFile = e.target.files[0];
      setImageUpload(newImageFile);
      const imageUrl = URL.createObjectURL(newImageFile);
      setCurrentImageUrl(imageUrl);
    } else {
      setImageUpload(null);
      setCurrentImageUrl("");
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
      let avatarUrl = imageUpload
        ? await appStore.uploadImage(imageUpload)
        : "/bear.jpg";
      const finalName = name.trim() ? name : "某位探險家";
      await appStore.addUser(user.uid, email, finalName, avatarUrl);
      toast.success("註冊成功!");
      console.log("註冊成功：", user);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === "auth/email-already-in-use") {
        toast.error("該電子郵件地址已被使用!");
      } else {
        toast.error("註冊失敗!");
      }
      console.error("註冊失敗：", firebaseError);
    }
  };
  const handleTabChange = (tabKey: any) => {
    setActiveTab(tabKey);
  };
  return (
    <div className="block h-[100vh] bg-white pt-20 md:flex">
      <div className="h-1/3 w-full object-cover md:h-auto md:w-1/3">
        <img src="/profile.jpg" className="h-full w-full object-cover " />
      </div>
      <div className="flex w-full items-center justify-center bg-white pt-0 md:w-2/3 ">
        <div>
          <Card className="w-[400px]">
            <div className="mb-6 rounded-lg p-12 md:p-4">
              <div className="mb-6 flex justify-center">
                <button
                  className={`mt-4 px-2 py-2 ${
                    activeTab === "login"
                      ? "tab-border-left h-auto w-1/2 bg-yellow text-white"
                      : "tab-border-left w-1/2 border-1 border-yellow"
                  }`}
                  onClick={() => handleTabChange("login")}
                >
                  <p className="leading-none">登入</p>
                </button>
                <button
                  className={`mt-4 px-2 py-2 ${
                    activeTab === "signup"
                      ? "tab-border-right h-auto w-1/2 bg-yellow  text-white"
                      : "tab-border-right w-1/2 border-1 border-yellow"
                  }`}
                  onClick={() => handleTabChange("signup")}
                >
                  <p className="leading-none">註冊</p>
                </button>
              </div>

              {activeTab === "login" && (
                <form className="flex flex-col gap-4 ">
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
                    尚未創建帳號?
                    <Link size="sm" onPress={() => setSelected("sign-up")}>
                      <p className="cursor-pointer text-green">註冊</p>
                    </Link>
                  </p>
                  <div className="flex justify-center gap-2">
                    <GlobalButton
                      variant="green"
                      content="登入"
                      onClick={handleLogin}
                    />
                  </div>
                </form>
              )}
              {activeTab === "signup" && (
                <form className="flex flex-col gap-4 ">
                  <Input
                    type="name"
                    label="暱稱"
                    value={name}
                    onChange={handleNameChange}
                  />
                  <Input
                    type="email"
                    label="請輸入email作為帳號"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <Input
                    type="password"
                    label="請輸入6字以上密碼"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <div className="container mx-auto mt-2 flex justify-center ">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <label
                      htmlFor="file-upload"
                      className="fc-today-button cursor-pointer rounded-lg bg-brown px-4 py-2 font-bold text-white hover:bg-darkYellow"
                    >
                      選擇頭貼
                    </label>
                  </div>
                  <div
                    className={`${
                      currentImageUrl
                        ? "mx-auto my-4 flex h-28 w-28 justify-center overflow-hidden rounded-full border"
                        : ""
                    }`}
                  >
                    {currentImageUrl && (
                      <img
                        src={currentImageUrl}
                        alt="Current Activity"
                        className="mb-2 h-full w-full  object-cover"
                      />
                    )}
                  </div>
                  <p className="text-center text-small">
                    已經有帳號了嗎?{" "}
                    <Link size="sm" onPress={() => setSelected("login")}>
                      <p className="cursor-pointer text-green">登入</p>
                    </Link>
                  </p>
                  <div className="flex justify-center gap-2">
                    <GlobalButton
                      variant="green"
                      content="註冊"
                      onClick={() => handleRegister(email, password)}
                    />
                  </div>
                </form>
              )}
            </div>
          </Card>
          <div className="flex rounded-lg border p-3">
            <p className="border-r pr-3 text-sm text-stone-500">
              Admin端
              <br />
              帳號：imadmin@gmail.com
              <br />
              密碼：88888888
              <br />
            </p>

            <p className="pl-3 text-sm text-stone-500">
              使用者測試
              <br />
              帳號：test001@gmail.com
              <br />
              密碼：123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Profile;
