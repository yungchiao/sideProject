import { Input, Textarea } from "@nextui-org/react";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
import Map from "../../components/Map";
import { ActivityType } from "../../type";
import Form from "./Form";
export const storage = getStorage(appStore.app);

const Activity: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState(false);
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
  const [hashtags, setHashtags] = useState<string[]>([]);
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
  const isAtLeastOneHashtagFilled = hashtags.some(
    (hashtag) => hashtag.trim() !== "",
  );
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
    setHashtags(Object.values(activity.hashtags));
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
    const newHashtags = [...hashtags];
    newHashtags[index] = event.target.value;
    setHashtags(newHashtags);
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
    isPlaceFilled &&
    isAtLeastOneHashtagFilled &&
    direction !== "";
  const handleCleanInfo = () => {
    setPrice("");
    setPlace("");
    setDirection("");
    setPosition({ latitude: null, longitude: null });
    setHashtags([]);
    setSearchLocation("");
    setActivityName("");
    setContent("");
    setImageUpload(null);
    setCurrentImageUrl("");
  };
  const handleSubmit = async () => {
    if (!isAllFieldsFilled) {
      toast.error("尚有未完成內容");
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
        handleCleanInfo();
        toast.success("活動更新成功！");
        console.log("活動更新成功！");
      } else {
        const articlesCollection = collection(appStore.db, "admin");
        const docRef = doc(articlesCollection);
        await setDoc(docRef, activityData);
        handleCleanInfo();
        toast.success("活動新增成功！");
      }
    } catch (error) {
      toast.error("活動處理失敗");
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
        <div className="mx-[50px] block w-full justify-center gap-4 pb-6 pt-36 sm:mx-[20px] lg:flex">
          <div className=" mt-2  h-[200px] w-full overflow-auto rounded-lg border bg-white p-6 md:h-[300px] lg:h-[1140px] lg:w-2/5 lg:px-10 lg:shadow-none">
            <h1 className="flex justify-center text-xl font-bold text-brown">
              活動列表
            </h1>
            <Form
              onActivitySelect={handleSelectedActivity}
              onSearchLocationChange={handleSearchLocationChange}
            />
          </div>
          <div className="mt-2 h-[1140px] w-full overflow-auto rounded-lg border bg-white p-6 lg:w-3/5 lg:px-10">
            <h1 className="mb-2 flex justify-center text-xl font-bold text-brown lg:mb-5">
              新增活動
            </h1>
            <div className="flex items-center">
              <p className="mr-2 whitespace-nowrap">活動名稱 </p>
              <Input
                maxLength={10}
                value={activityName}
                onChange={handleActivityNameChange}
              />
            </div>
            <div className="mt-4 flex items-center">
              <p className="mr-2 whitespace-nowrap">活動價格 </p>
              <Input
                type="number"
                maxLength={5}
                onChange={handlePriceChange}
                value={price.toString()}
              />
            </div>
            <div className="my-6 mt-8">
              <div className="mb-2 ">
                <p>{formatDateRange(startDate, endDate)}</p>
              </div>
              <div className="z-30 flex justify-start ">
                <div className="mb-4 text-center">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    showTimeSelect
                    selectsStart
                    minTime={setHours(setMinutes(new Date(), 0), 24)}
                    maxTime={setHours(setMinutes(new Date(), 59), 23)}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="z-30  w-[230px] rounded-md border-2 border-brown bg-white px-2"
                  />
                  <p className="text-lg">|</p>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    showTimeSelect
                    selectsEnd
                    minDate={startDate}
                    minTime={setHours(setMinutes(new Date(), 0), 24)}
                    maxTime={setHours(setMinutes(new Date(), 59), 23)}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className=" z-30  w-[230px] rounded-md border-2 border-brown bg-white px-2"
                  />
                </div>
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
            <div className="mb-4">
              <GlobalButton
                variant="white"
                content="more #hashtag"
                onClick={addAmount}
              />
            </div>

            <div className="grid w-full grid-cols-12 gap-4">
              <Input
                maxLength={10}
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
            <div className="gp-4 grid w-full grid-cols-12">
              <div className="my-4">
                <p className=" mb-2 text-xs">
                  Latitude: {position.latitude?.toString()}
                </p>
                <p className="text-xs">
                  Longitude: {position.longitude?.toString()}
                </p>
              </div>
            </div>
            <select
              aria-label="Select Activity Direction"
              className="max-w-xs cursor-pointer rounded-lg bg-gray-100 p-4 text-sm text-gray-500"
              onChange={(e) => setDirection(e.target.value)}
              value={direction}
            >
              <option value="">{direction ? direction : "選擇活動地區"}</option>
              {directionItems.map((item) => (
                <option
                  key={item}
                  value={item}
                  className="rounded-none bg-brown text-gray-100 hover:bg-darkBrown"
                >
                  {item}
                </option>
              ))}
            </select>
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
                  className="fc-today-button  cursor-pointer rounded-lg bg-brown px-4 py-2 font-bold text-white transition duration-200 hover:bg-darkYellow"
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
              maxLength={300}
              variant="bordered"
              placeholder="活動描述"
              disableAnimation
              disableAutosize
              value={content}
              onChange={handleContent}
              classNames={{
                base: "w-full",
                input: "resize-y min-h-[134px]",
              }}
            />
            <div className="justify-cente mx-auto mt-10 grid items-center">
              <GlobalButton
                variant="green"
                content="新增"
                onClick={handleSubmit}
                disabled={!isAllFieldsFilled}
              />
              {isLoading && (
                <div className="mt-6 flex justify-center gap-2">
                  <img
                    src="./gravity-logo.png"
                    className="spin-slow relative mx-auto flex h-[40px] w-[40px] object-cover"
                  />
                  <p className="flex items-center">上傳中...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Activity;
