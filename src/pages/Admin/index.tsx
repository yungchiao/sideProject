import { Button, Input, Textarea } from "@nextui-org/react";
import {
  Timestamp,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { forwardRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import Map from "../../components/Map";
import Form from "./Form";
export const storage = getStorage(appStore.app);

interface Hashtag {
  [key: number]: string;
}
interface ActivityType {
  id: string;
  name: string;
  imagesFile: File;
  price: number;
  content: string;
  hashtags: { [key: string]: string };
  latitude: string;
  longitude: string;
  startTime: Timestamp;
  endTime: Timestamp;
  images: string;
  place: string;
  direction: string;
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
        className="w-[450px] rounded-md border border-stone-500 p-1 outline-none"
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
const Admin: React.FC = observer(() => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [items, setItems] = useState<number>(1);
  const [price, setPrice] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [position, setPosition] = useState<{
    latitude: string | null;
    longitude: string | null;
  }>({ latitude: null, longitude: null });
  const [hashtags, setHashtags] = useState<Hashtag>({});
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null,
  );
  useEffect(() => {
    console.log("dateRange value:", dateRange);
  }, [dateRange]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    if (Array.isArray(dates) && dates.length === 2) {
      setDateRange(dates);
    } else {
      console.error("Selected dates are invalid");

      setDateRange([null, null]);
    }
  };

  const handleSelectedActivity = (activity: ActivityType) => {
    const start = activity.startTime.toDate();
    const end = activity.endTime.toDate();
    console.log("Before updating dateRange:", dateRange);
    setDateRange([start, end]);
    console.log("After updating dateRange:", dateRange);
    setCurrentImageUrl(activity.images);
    setSelectedImageFile(null);
    setSelectedActivity(activity);
    setActivityName(activity.name);
    setPrice(activity.price.toString());
    setContent(activity.content);
    setImageUpload(activity.imagesFile);
    setHashtags(activity.hashtags);
    setPlace(activity.place);
    setDirection(activity.direction);
    setPosition({
      latitude: activity.latitude || "",
      longitude: activity.longitude || "",
    });
  };

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (start instanceof Date && end instanceof Date) {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const startFormatted = start.toLocaleString("zh-TW", options);
      const endFormatted = end.toLocaleString("zh-TW", options);
      return `${startFormatted} - ${endFormatted}`;
    }
    return "請選擇日期與時間";
  };

  const uploadImage = async (imagesFile: File): Promise<string> => {
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

  const handlePositionChange = (newPosition: any) => {
    setPosition(newPosition);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newImageFile = event.target.files[0];
      setImageUpload(newImageFile);
      setSelectedImageFile(newImageFile);
      setCurrentImageUrl(URL.createObjectURL(newImageFile));
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
      let imageUrlToSave = currentImageUrl;

      if (selectedImageFile) {
        imageUrlToSave = await uploadImage(selectedImageFile);
      }

      const activityData = {
        name: activityName,
        startTime: startDate,
        endTime: endDate,
        hashtags: Object.values(hashtags),
        content: content,
        latitude: position.latitude || "0",
        longitude: position.longitude || "0",
        images: imageUrlToSave,
        price: price,
        place: place,
        direction: direction,
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
    <>
      {appStore.currentUserEmail === "imadmin@gmail.com" ? (
        <div className="flex">
          <div className="h-[1200px] w-48 bg-stone-300 px-5 pt-28">
            <button className="mt-2 h-10 w-full  border-b-2 border-neutral-100 pb-8 ">
              <p className="text-stone-800 hover:text-neutral-400">
                <Link to="/checkout">訂單總覽</Link>
              </p>
            </button>
            <button className="mt-4 h-10 w-full  border-b-2 border-neutral-100 pb-8">
              <p className="text-stone-800 hover:text-neutral-400">
                <Link to="/adminabout">團隊資訊</Link>
              </p>
            </button>
          </div>
          <div className=" ml-[100px] flex w-4/5 justify-center gap-4 pb-10 pt-28">
            <div className="mt-2 h-screen w-3/5 overflow-scroll rounded-lg border bg-white p-10">
              <h1 className="mb-5 flex justify-center text-xl font-bold text-brown">
                新增活動
              </h1>
              <Input
                label="活動名稱"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
              />
              <div className="mt-4 ">
                <Input
                  label="活動價格"
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
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  customInput={<CustomInput />}
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
                  onChange={handlePlaceChange}
                  value={place}
                />
              </div>
              <Map onPositionChange={handlePositionChange} />
              <div className="grid w-full grid-cols-12 gap-4">
                <div className="my-4">
                  <p className=" mb-2 text-xs">
                    Latitude: {position.latitude?.toString()}
                  </p>
                  <p className="text-xs">
                    Longitude: {position.longitude?.toString()}
                  </p>
                </div>
              </div>
              <Input
                label="活動地區"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="mb-4"
              />
              <div className="block">
                <input
                  type="file"
                  className="mb-4 "
                  onChange={handleImageChange}
                />
                <Button className="mb-4 border border-stone-800 bg-white">
                  <p className=" text-stone-800">上傳檔案</p>
                </Button>
                {currentImageUrl && (
                  <img
                    src={currentImageUrl}
                    alt="Current Activity"
                    className="mb-2 h-auto w-24"
                  />
                )}
              </div>
              <Textarea
                variant="bordered"
                placeholder="活動描述"
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
            </div>
            <div className=" mt-2 max-h-screen w-2/5 overflow-scroll rounded-lg border bg-white p-10">
              <h1 className="flex justify-center text-xl font-bold text-brown">
                已上架活動列表
              </h1>
              <Form onActivitySelect={handleSelectedActivity} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[650px] items-center justify-center pt-28">
          只有 Admin 身份可進入此頁面。
        </div>
      )}
    </>
  );
});

export default Admin;
