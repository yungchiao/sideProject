import { Button, Input, Textarea } from "@nextui-org/react";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import Form from "./Form";
export const storage = getStorage(appStore.app);

interface Hashtag {
  [key: number]: string;
}
interface ActivityType {
  id: string;
  name: string;
  images: File;
  price: number;
  content: string;
  hashtags: { [key: string]: string };
  position: string;
}

const Admin: React.FC = observer(() => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [imageName, setImageName] = useState("");
  const [startDate, endDate] = dateRange;
  const [items, setItems] = useState<number>(1);
  const [price, setPrice] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [hashtags, setHashtags] = useState<Hashtag>({});
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null,
  );
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
  };
  const handleSelectedActivity = (activity: ActivityType) => {
    setSelectedActivity(activity);
    setActivityName(activity.name);
    setPrice(activity.price.toString());
    setContent(activity.content);
    setImageUpload(activity.images);
    setPosition(activity.position);
    setHashtags(activity.hashtags);
  };

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      const startFormatted = start.toLocaleDateString();
      const endFormatted = end.toLocaleDateString();
      return `${startFormatted}-${endFormatted}`;
    }

    return "Select Date Range";
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageUpload) {
      throw new Error("No image file provided");
    }
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    return getDownloadURL(imageRef);
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

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageUpload(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };
  const handleSubmit = async () => {
    try {
      let imageUrl = "";
      if (imageUpload) {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        imageUrl = await getDownloadURL(imageRef);
      }

      const activityData = {
        name: activityName,
        startTime: startDate,
        endTime: endDate,
        hashtags: Object.values(hashtags),
        content: content,
        position: position,
        images: imageUrl,
        price: price,
      };

      if (selectedActivity) {
        const docRef = doc(appStore.db, "admin", selectedActivity.id);
        await updateDoc(docRef, activityData);
        alert("活動更新成功！");
        console.log("活動更新成功！");
      } else {
        const articlesCollection = collection(appStore.db, "admin");
        const docRef = doc(articlesCollection);
        await setDoc(docRef, activityData);

        console.log("活動新增成功！");
      }
    } catch (error) {
      console.error("活動處理失敗", error);
    }
  };
  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };

  const variant = "underlined";
  return (
    <div className="m-auto mt-28 flex w-4/5 border p-10">
      <div className="m-auto mt-2 max-h-screen w-3/5 overflow-scroll border p-10">
        <Input
          label="Activity Name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
        />
        <div className="mt-4 ">
          <Input
            label="Price"
            onChange={handlePriceChange}
            value={price.toString()}
          />
        </div>
        <div className="mt-4">
          <p>{formatDateRange(startDate, endDate)}</p>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            className="z-20 mb-4 w-60 cursor-pointer rounded-lg bg-stone-800 text-center text-gray-100"
          />
        </div>

        {Array.from({ length: items }, (_, i) => (
          <Input
            type="url"
            className="mb-4 w-40"
            placeholder="hashtag"
            labelPlacement="outside"
            value={hashtags[i] || ""}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-small text-default-400">#</span>
              </div>
            }
            key={i}
            onChange={(e) => handleHashtagChange(i, e)}
          />
        ))}
        <Button
          className="mb-4 border border-stone-800 bg-white"
          onClick={addAmount}
        >
          <p className="text-stone-800">more #hashtag</p>
        </Button>

        <div className="grid w-full grid-cols-12 gap-4">
          <Input
            key={variant}
            variant={variant}
            labelPlacement="outside"
            placeholder="輸入地點"
            className="col-span-12 mb-6 md:col-span-6 md:mb-4"
            onChange={handlePositionChange}
            value={position}
          />
        </div>
        <div className="flex">
          <input
            type="file"
            className="mb-4 "
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageUpload(e.target.files[0]);
              }
            }}
          ></input>
          <Button
            className="mb-2 border border-stone-800 bg-white"
            onClick={uploadImage}
          >
            <p className="text-stone-800">上傳檔案</p>
          </Button>
        </div>
        <Textarea
          variant="bordered"
          placeholder="Enter your description"
          disableAnimation
          disableAutosize
          value={content}
          onChange={handleContent}
          classNames={{
            base: "w-4/5 ",
            input: "resize-y min-h-[134px]",
          }}
        />
        <div className="mx-auto mt-10 flex items-center justify-center">
          <Button onClick={handleSubmit} className="bg-stone-800">
            <p className="text-white">新增</p>
          </Button>
        </div>
        <button className="mt-8 h-10 w-full rounded-md bg-gray-800">
          <p className="text-white">
            <Link to="/adminchat">又要跟客戶聊聊</Link>
          </p>
        </button>
      </div>
      <div className="ml-4 mt-2 max-h-screen w-2/5 overflow-scroll border p-10">
        <Form onActivitySelect={handleSelectedActivity} />
      </div>
    </div>
  );
});

export default Admin;
