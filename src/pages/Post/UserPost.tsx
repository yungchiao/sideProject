import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}
const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <div
      className="flex items-center gap-2 border-gray-300 p-2"
      onClick={onClick}
    >
      <input
        type="text"
        className="w-[180px] rounded-md border border-stone-500 p-1 outline-none"
        value={value || ""}
        ref={ref}
        readOnly
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-6 w-6 cursor-pointer"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
        />
      </svg>
    </div>
  ),
);
const UserPost: React.FC = observer(() => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
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
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
  };
  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (start && end) {
      const startFormatted = start.toLocaleDateString();
      const endFormatted = end.toLocaleDateString();
      return `${startFormatted}-${endFormatted}`;
    }

    return "選擇參加活動時間";
  };
  const uploadImage = async (): Promise<string> => {
    if (!imageUpload) throw new Error("No image file provided");
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    await uploadBytes(imageRef, imageUpload);
    return getDownloadURL(imageRef);
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
        const avatarUrl =
          appStore.newUser?.avatar || "http://www.w3.org/2000/svg";
        setDoc(docRef, {
          name: activityName,
          startTime: startDate,
          endTime: endDate,
          weather: selectedOption,
          hashtags: Object.values(hashtags),
          content: content,
          position: position,
          image: imageUrl,
          avatar: avatarUrl,
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
            className="rounded-none bg-stone-500 text-gray-100"
          >
            {admin.name}
          </SelectItem>
        ))}
      </Select>

      <div className="mt-4">
        <p className="text-sm text-stone-600">
          {formatDateRange(startDate, endDate)}
        </p>

        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
          customInput={<CustomInput />}
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
      <input
        type="file"
        className="mb-4 "
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setImageUpload(e.target.files[0]);
          } else {
            setImageUpload(null);
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
        placeholder="輸入你的心得輸入你的心得"
        disableAnimation
        disableAutosize
        classNames={{
          base: "w-4/5 ",
          input: "resize-y min-h-[120px]",
        }}
        onChange={handleContent}
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
