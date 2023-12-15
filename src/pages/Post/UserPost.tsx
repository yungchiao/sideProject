import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
export const storage = getStorage(appStore.app);
interface Hashtag {
  [key: string]: boolean;
}
interface Admin {
  id: string;
  name: string;
  position: string;
  price: number;
  images: string;
  hashtags: [];
  startTime: Timestamp;
  endTime: Timestamp;
  content: string;
  postId: string;
}

const UserPost: React.FC = observer(() => {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 24),
  );
  const [endDate, setEndDate] = useState(
    setHours(setMinutes(new Date(), 30), 24),
  );
  const [items, setItems] = useState<number>(1);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [hashtags, setHashtags] = useState<Hashtag>({});
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  useEffect(() => {
    appStore.fetchAdmin();
  }, []);

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (start instanceof Date && end instanceof Date) {
      const startFormatted = start.toLocaleString("zh-TW");
      const endFormatted = end.toLocaleString("zh-TW");
      return `${startFormatted} - ${endFormatted}`;
    }
    return "請選擇日期與時間";
  };

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
    setHashtags({ ...hashtags, [index]: event.target.value });
  };

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(event.target.value);
  };
  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
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
          startTime: startDate,
          endTime: endDate,
          weather: selectedOption,
          hashtags: Object.values(hashtags),
          content: content,
          position: position,
          image: imageUrl,
          id: appStore.currentUserEmail,
          postId: docRef.id,
        });
      }
      console.log("貼文已添加到 Firestore");
      alert("已發布貼文！");
    } catch (error) {
      console.error("添加貼文失敗", error);
    }
  };

  const variant = "underlined";

  return (
    <div>
      {appStore.newUser ? (
        <div className="h-screen-bg m-auto w-3/4  p-10 pb-40 pt-28">
          <Select
            aria-label="Select Activity Name"
            label={activityName ? "" : "選擇活動名稱"}
            className="max-w-xs"
            onChange={(e) => {
              const selectedAdmin = appStore.admins.find(
                (admin) => admin.id === e.target.value,
              );
              if (selectedAdmin) {
                setActivityName(selectedAdmin.name);
              }
            }}
          >
            {appStore.admins.map((admin: Admin) => (
              <SelectItem
                key={admin.id}
                value={admin.id}
                className="rounded-none bg-brown text-gray-100"
              >
                {admin.name}
              </SelectItem>
            ))}
          </Select>
          <div className="mt-4">
            <div className="my-4 ">
              <p>{formatDateRange(startDate, endDate)}</p>
            </div>
            <div className="mb-4 flex gap-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => date && setStartDate(date)}
                showTimeSelect
                selectsStart
                minTime={setHours(setMinutes(new Date(), 0), 24)}
                maxTime={setHours(setMinutes(new Date(), 59), 23)}
                dateFormat="MMMM d, yyyy h:mm aa"
                className=" w-[230px]  rounded-md border-2 border-green px-2"
              />
              <p className="text-xl">-</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => date && setEndDate(date)}
                showTimeSelect
                selectsEnd
                minDate={startDate}
                minTime={setHours(setMinutes(new Date(), 0), 24)}
                maxTime={setHours(setMinutes(new Date(), 59), 23)}
                dateFormat="MMMM d, yyyy h:mm aa"
                className=" w-[230px]  rounded-md border-2 border-green px-2"
              />
            </div>
          </div>
          {Array.from({ length: items }).map((_, index) => (
            <Input
              maxLength={6}
              type="url"
              className="mb-4 w-40"
              placeholder="hashtag"
              labelPlacement="outside"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-small text-default-400">#</span>
                </div>
              }
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
          <div className="grid w-full grid-cols-12 gap-4">
            <Input
              key={variant}
              variant={variant}
              labelPlacement="outside"
              placeholder="輸入地點"
              className="col-span-12 mb-6 md:col-span-6 md:mb-4"
              onChange={handlePositionChange}
            />
          </div>
          <form className="mb-4 ">
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
                } else {
                  setImageUpload(null);
                }
              }}
            ></input>
            <label
              htmlFor="file-upload"
              className="fc-today-button cursor-pointer rounded-lg bg-yellow px-4 py-2 font-bold text-white hover:bg-darkYellow"
            >
              選擇照片
            </label>
          </div>
          <Textarea
            maxLength={200}
            variant="bordered"
            placeholder="輸入你的心得"
            disableAnimation
            disableAutosize
            classNames={{
              base: "w-4/5 ",
              input: "resize-y min-h-[120px]",
            }}
            onChange={handleContent}
          />
          <div className="mx-auto mt-10 flex items-center justify-center">
            <Button className="bg-stone-800" onClick={handleSubmit}>
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
