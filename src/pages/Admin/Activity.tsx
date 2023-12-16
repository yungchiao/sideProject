import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import {
  Timestamp,
  collection,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

const Activity: React.FC = observer(() => {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 24),
  );
  const [endDate, setEndDate] = useState(
    setHours(setMinutes(new Date(), 30), 24),
  );
  const [items, setItems] = useState<number>(1);
  const [price, setPrice] = useState<string>("");
  const [place, setPlace] = useState<string>("");
  const [direction, setDirection] = useState<string>("");
  const [position, setPosition] = useState<{
    latitude: string | null;
    longitude: string | null;
  }>({ latitude: null, longitude: null });
  const [hashtags, setHashtags] = useState<Hashtag>({});
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [activityName, setActivityName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null,
  );

  const [isActivityNameFilled, setIsActivityNameFilled] = useState(false);
  const [isPriceFilled, setIsPriceFilled] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isContentFilled, setIsContentFilled] = useState(false);
  const [isPlaceFilled, setIsPlaceFilled] = useState(false);

  const handleSelectedActivity = (activity: ActivityType) => {
    const start = activity.startTime.toDate();
    const end = activity.endTime.toDate();
    setStartDate(start);
    setEndDate(end);
    setCurrentImageUrl(activity.images);
    setSelectedImageFile(null);
    setSelectedActivity(activity);
    setActivityName(activity.name);
    setPrice(activity.price.toString());
    setContent(activity.content);
    setImageUpload(activity.imagesFile);
    setHashtags(activity.hashtags);
    setPlace(activity.place);
    setPosition({
      latitude: activity.latitude || "",
      longitude: activity.longitude || "",
    });
    setDirection(activity.direction);
    setPosition({
      latitude: activity.latitude || "",
      longitude: activity.longitude || "",
    });
    setSearchLocation(activity.place);
    setIsActivityNameFilled(activity.name !== "");
    setIsPriceFilled(activity.price.toString() !== "");
    setIsImageUploaded(true);
    setIsContentFilled(activity.content !== "");
    setIsPlaceFilled(activity.place !== "");
  };

  const formatDateRange = (start: Date | null, end: Date | null) => {
    if (start instanceof Date && end instanceof Date) {
      const startFormatted = start.toLocaleString("zh-TW");
      const endFormatted = end.toLocaleString("zh-TW");
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

  const handleActivityNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setActivityName(event.target.value);
    setIsActivityNameFilled(event.target.value !== "");
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
  const isPositionValid = () => {
    return position.latitude && position.longitude;
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(event.target.value);
    setIsPriceFilled(event.target.value !== "");
  };
  const handleSearchLocationChange = (newLocation: any) => {
    setSearchLocation(newLocation);
  };

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
    setIsContentFilled(event.target.value !== "");
  };

  const handlePlaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(event.target.value);
    setIsPlaceFilled(event.target.value !== "");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newImageFile = event.target.files[0];
      setImageUpload(newImageFile);
      setSelectedImageFile(newImageFile);
      setCurrentImageUrl(URL.createObjectURL(newImageFile));
      setIsImageUploaded(true);
    }
  };
  const isAllFieldsFilled =
    isActivityNameFilled !== false &&
    isPositionValid() &&
    isPriceFilled &&
    isImageUploaded &&
    isContentFilled &&
    direction !== "";

  const handleSubmit = async () => {
    if (!isAllFieldsFilled) {
      alert("尚有未完成內容");
      return;
    }
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
        alert("活動新增成功！");
        console.log("活動新增成功！");
      }
    } catch (error) {
      console.error("活動處理失敗", error);
    }
  };
  const directionItems = ["北", "中", "南", "東"];
  const addAmount = () => {
    setItems((prevItems) => prevItems + 1);
  };
  const variant = "underlined";
  return (
    <>
      <div className="flex">
        <div className=" mx-[50px] flex w-full justify-center gap-4 pb-10 pt-28">
          <div className="mt-2 w-3/5 overflow-auto rounded-lg border bg-white p-10">
            <h1 className="mb-5 flex justify-center text-xl font-bold text-brown">
              新增活動
            </h1>
            <Input
              maxLength={10}
              label="活動名稱"
              value={activityName}
              onChange={handleActivityNameChange}
            />
            <div className="mt-4 ">
              <Input
                maxLength={5}
                label="活動價格"
                onChange={handlePriceChange}
                value={price.toString()}
              />
            </div>
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
                  className=" w-[230px]  rounded-md border-2 border-green px-2 "
                />
                <p className="text-2xl">-</p>
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
            {Array.from({ length: items }, (_, i) => (
              <Input
                maxLength={8}
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
                maxLength={5}
                key={variant}
                variant={variant}
                labelPlacement="outside"
                placeholder="輸入地點"
                className="col-span-12 mb-6 md:col-span-6 md:mb-4"
                onChange={handlePlaceChange}
                value={place}
              />
            </div>
            <Map
              searchLocation={searchLocation}
              onPositionChange={handlePositionChange}
            />
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
            <Select
              aria-label="Select Activity Direction"
              label={direction ? direction : "選擇活動地區"}
              className="max-w-xs"
              onChange={(e) => setDirection(e.target.value)}
              value={direction}
            >
              {directionItems.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="rounded-none bg-brown text-gray-100"
                >
                  {item}
                </SelectItem>
              ))}
            </Select>
            <div className="container mt-2 flex gap-6 ">
              <div className="my-8">
                <input
                  type="file"
                  id="file-upload"
                  className=" hidden"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="file-upload"
                  className="fc-today-button  cursor-pointer rounded-lg bg-brown px-4 py-2 font-bold text-white hover:bg-darkYellow"
                >
                  選擇圖片
                </label>
              </div>
              <div>
                {currentImageUrl && (
                  <img
                    src={currentImageUrl}
                    alt="Current Activity"
                    className="mb-2 h-auto w-24"
                  />
                )}
              </div>
            </div>
            <Textarea
              maxLength={200}
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
              <Button
                onClick={handleSubmit}
                disabled={!isAllFieldsFilled}
                className={`bg-green px-4 py-2 text-white hover:bg-darkGreen ${
                  !isAllFieldsFilled
                    ? "disabled:cursor-not-allowed disabled:bg-stone-200"
                    : ""
                }`}
              >
                <p className="text-white">新增</p>
              </Button>
            </div>
          </div>
          <div className=" mt-2 h-[1140px] w-2/5 overflow-auto rounded-lg border bg-white p-10">
            <h1 className="flex justify-center text-xl font-bold text-brown">
              已上架活動列表
            </h1>
            <Form
              onActivitySelect={handleSelectedActivity}
              onSearchLocationChange={handleSearchLocationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export default Activity;
