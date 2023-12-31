import { Button, Textarea } from "@nextui-org/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
export const storage = getStorage(appStore.app);

const UserPost: React.FC = observer(() => {
  const [items, setItems] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([""]);
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isContentFilled, setIsContentFilled] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    appStore.fetchAdmin();
  }, []);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };
  const handleHashtagChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newHashtags = [...hashtags];
    newHashtags[index] = event.target.value;
    setHashtags(newHashtags);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
    setIsContentFilled(event.target.value !== "");
  };
  const handleCleanInfo = () => {
    setSelectedOption("");
    setHashtags([]);
    setActivityName("");
    setContent("");
    setImageUpload(null);
    setIsContentFilled(false);
    setCurrentImageUrl("");
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (imageUpload) {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        const articlesCollection = collection(appStore.db, "activity");
        const docRef = doc(articlesCollection);

        setDoc(docRef, {
          name: activityName,
          weather: selectedOption,
          hashtags: Object.values(hashtags),
          content: content,
          createdAt: new Date(),
          image: imageUrl,
          id: appStore.currentUserEmail,
          userName: appStore.newUser?.name,
          postId: docRef.id,
        });
      }
      handleCleanInfo();
      toast.success("已發布貼文！");
      setIsLoading(false);
    } catch (error) {
      console.error("添加貼文失敗", error);
    }
  };
  const isAllFieldsFilled =
    isContentFilled && activityName !== "" && imageUpload;

  return (
    <div>
      {appStore.newUser ? (
        <div className="mx-auto h-screen w-3/4  pb-28 pt-40">
          <select
            aria-label="Select Activity Name"
            value={activityName}
            className="mb-4 max-w-xs cursor-pointer rounded-lg bg-white p-4 text-sm text-gray-500"
            onChange={(e) => {
              const selectedAdmin = appStore.admins.find(
                (admin) => admin.id === e.target.value,
              );
              if (selectedAdmin) {
                setActivityName(selectedAdmin.name);
              } else {
                setActivityName("");
              }
            }}
          >
            <option value="">
              {activityName ? activityName : "選擇活動名稱"}
            </option>
            {appStore.admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
          {Array.from({ length: items }).map((_, index) => (
            <input
              maxLength={10}
              type="url"
              className="mb-4 block w-40 rounded-lg bg-white px-4 py-2"
              placeholder="hashtag"
              value={hashtags[index] || ""}
              key={index}
              onChange={(e) => handleHashtagChange(index, e)}
            />
          ))}
          <Button
            className="mb-4 border border-stone-800 bg-white"
            onClick={addAmount}
          >
            <p className="text-stone-800">更多 #hashtag</p>
          </Button>
          <form className="my-4">
            <div className="flex">
              <div className="whitespace-nowrap">
                <label className="mr-4 ">
                  <input
                    type="radio"
                    value="Sunny"
                    checked={selectedOption === "Sunny"}
                    onChange={handleRadioChange}
                  />
                  Sunny
                </label>
              </div>
              <div className="whitespace-nowrap">
                <input
                  type="radio"
                  value="Rainy"
                  checked={selectedOption === "Rainy"}
                  onChange={handleRadioChange}
                />

                <label className="mr-4 ">Rainy</label>
              </div>
              <div className=" whitespace-nowrap">
                <input
                  type="radio"
                  value="Cloudy"
                  checked={selectedOption === "Cloudy"}
                  onChange={handleRadioChange}
                />
                <label>Cloudy</label>
              </div>
            </div>
          </form>
          <div className="container my-4 mt-2 flex">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageUpload(e.target.files[0]);
                  setCurrentImageUrl(URL.createObjectURL(e.target.files[0]));
                } else {
                  setImageUpload(null);
                }
              }}
            ></input>
            <label
              htmlFor="file-upload"
              className="fc-today-button my-4 cursor-pointer rounded-lg bg-yellow px-4 py-2 font-bold text-white hover:bg-darkYellow"
            >
              選擇照片
            </label>
          </div>
          <div>
            {currentImageUrl && (
              <img
                src={currentImageUrl}
                alt="Current Activity"
                className="mb-4 h-auto w-24"
              />
            )}
          </div>
          <Textarea
            maxLength={400}
            value={content}
            variant="bordered"
            placeholder="輸入你的心得"
            disableAnimation
            disableAutosize
            classNames={{
              base: "w-full ",
              input: "resize-y min-h-[180px] max-h-[200px]",
            }}
            onChange={handleContent}
          />
          <div className="mx-auto mt-10 grid items-center text-center">
            <div>
              <GlobalButton
                variant="green"
                content="發布"
                disabled={!isAllFieldsFilled}
                onClick={handleSubmit}
              />
              {isLoading && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <img
                    src="./gravity-logo.png"
                    className="spin-slow relative flex h-[40px] w-[40px] object-cover"
                  />
                  <p className="flex items-center">上傳中...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-40 flex h-[100vh] items-center justify-center   text-center">
          <div className="block rounded-md border px-40 py-6">
            <h1 className="mb-4 text-3xl">登入後即可發文</h1>
            <Link to="/profile">
              <Button>登入</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});

export default UserPost;
