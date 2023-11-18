import { Button, Input, Textarea } from "@nextui-org/react";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import Form from "./Form";

export const storage = getStorage(appStore.app);

interface Hashtag {
  [key: number]: string;
}

const Admin: React.FC = observer(() => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [items, setItems] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [position, setPosition] = useState<string>("");
  const [hashtags, setHashtags] = useState<Hashtag>({});
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);

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
    setPrice(Number(event.target.value));
  };

  const handleContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (imageUpload) {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload);
        const imageUrl = await getDownloadURL(imageRef);
        const articlesCollection = collection(appStore.db, "admin");
        const docRef = doc(articlesCollection);
        setDoc(docRef, {
          name: activityName,
          date: selectedDate,
          hashtags: Object.values(hashtags),
          content: content,
          position: position,
          images: imageUrl,
          price: price,
        });
      }

      console.log("活動新增成功！");
    } catch (error) {
      console.error("活動新增失敗qq", error);
    }
  };
  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };
  const variant = "underlined";
  return (
    <div className="m-auto mt-10 flex w-4/5 border p-10">
      <div className="m-auto mt-10 w-3/5 border p-10">
        <Input
          label="Activity Name"
          onChange={(e) => setActivityName(e.target.value)}
        />
        <div className="mt-4 ">
          <Input label="Price" onChange={handlePriceChange} />
        </div>
        <div className="mt-4 ">
          <DatePicker
            className="z-20 mb-4 cursor-pointer rounded-lg bg-stone-800 text-center text-gray-100"
            selected={selectedDate}
            onChange={(date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
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
        <Textarea
          variant="bordered"
          placeholder="Enter your description"
          disableAnimation
          disableAutosize
          onChange={() => handleContent}
        />
        <div className="mx-auto mt-10 flex items-center justify-center">
          <Button onClick={handleSubmit} className="bg-stone-800">
            <p className="text-white">新增</p>
          </Button>
        </div>
      </div>
      <div className="ml-4 mt-10 w-2/5 border p-10">
        <Form />
      </div>
    </div>
  );
});

export default Admin;
