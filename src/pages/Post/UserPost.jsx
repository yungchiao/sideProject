import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import { animals } from "./activityName";
export const storage = getStorage(appStore.app);
const UserPost = observer(() => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [position, setPosition] = useState("");
  const [hashtags, setHashtags] = useState({});
  const [activityName, setActivityName] = useState("");
  const [content, setContent] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const uploadImage = async () => {
    try {
      if (imageUpload === null) return;
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("上傳圖片失敗", error);
      throw error;
    }
  };
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };
  const handleHashtagChange = (index, event) => {
    const updatedHashtags = { ...hashtags, [index]: event.target.value };
    setHashtags(updatedHashtags);
  };
  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };
  const handleContent = (value) => {
    setContent({ ...content, value });
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
          date: selectedDate,
          weather: selectedOption,
          hashtags: Object.values(hashtags),
          content: content,
          position: position,
          image: imageUrl,
        });
      }

      console.log("貼文已添加到 Firestore");
    } catch (error) {
      console.error("添加貼文失敗", error);
    }
  };

  const variant = "underlined";
  return (
    <div className="m-auto mt-10 w-3/4 border p-10">
      <Select
        label="選擇活動名稱"
        className="mb-2 max-w-xs"
        onChange={(e) => setActivityName(e.target.value)}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.value} value={animal.value}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
      <div className="mt-4 ">
        <DatePicker
          className="z-20 mb-4 cursor-pointer rounded-lg bg-stone-800 text-center text-gray-100"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
      {Array.from({ length: items }).map((_, index) => (
        <Input
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
      <input
        type="file"
        className="mb-4 "
        onChange={(e) => setImageUpload(e.target.files[0])}
      ></input>
      <Button
        className="mb-2 border border-stone-800 bg-white"
        onClick={uploadImage}
      >
        <p className="text-stone-800">上傳檔案</p>
      </Button>
      <Textarea
        variant="bordered"
        placeholder="Enter your description"
        disableAnimation
        disableAutosize
        classNames={{
          base: "w-4/5 ",
          input: "resize-y min-h-[120px]",
        }}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="mx-auto mt-10 flex items-center justify-center">
        <Button className="bg-stone-800">
          <p className="text-gray-100" onClick={handleSubmit}>
            發布
          </p>
        </Button>
      </div>
    </div>
  );
});

export default UserPost;
