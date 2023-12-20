import { Button, Textarea } from "@nextui-org/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
export const storage = getStorage(appStore.app);

const UserPost: React.FC = observer(() => {
  const [items, setItems] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("Sunny");
  const [hashtags, setHashtags] = useState<string[]>(["好玩"]);
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("好希望能再參加！");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isContentFilled, setIsContentFilled] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

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

      alert("已發布貼文！");
    } catch (error) {
      console.error("添加貼文失敗", error);
    }
  };
  const isAllFieldsFilled =
    isContentFilled && activityName !== "" && imageUpload;

  return (
    <div>
      {appStore.newUser ? (
        <div className="m-auto h-[100vh] w-3/4  p-10 pb-28 pt-40">
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
              // labelPlacement="outside"
              value={hashtags[index] || ""}
              // startContent={
              //   <div className="pointer-events-none flex items-center">
              //     <span className="text-small text-default-400">#</span>
              //   </div>
              // }
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
          <form className="my-4 ">
            <label className="mr-4 ">
              <input
                type="radio"
                value="Sunny"
                checked={selectedOption === "Sunny"}
                onChange={handleRadioChange}
              />
              Sunny
            </label>
            <label className="mr-4 ">
              <input
                type="radio"
                value="Rainy"
                checked={selectedOption === "Rainy"}
                onChange={handleRadioChange}
              />
              Rainy
            </label>
            <label className="mr-4 ">
              <input
                type="radio"
                value="Cloudy"
                checked={selectedOption === "Cloudy"}
                onChange={handleRadioChange}
              />
              Cloudy
            </label>
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
              base: "w-4/5 ",
              input: "resize-y min-h-[180px] max-h-[200px]",
            }}
            onChange={handleContent}
          />
          <div className="mx-auto mt-10 flex items-center justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!isAllFieldsFilled}
              className={`bg-green px-4 py-2 text-white hover:bg-darkGreen ${
                !isAllFieldsFilled
                  ? "disabled:cursor-not-allowed disabled:bg-stone-200"
                  : ""
              }`}
            >
              <p className="text-gray-100">發布</p>
            </Button>
          </div>{" "}
        </div>
      ) : (
        <div className="h-screen-bg  mx-40   flex items-center justify-center   text-center">
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
