import { Button, Input, Textarea } from "@nextui-org/react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";

export const storage = getStorage(appStore.app);

const AdminAbout: React.FC = observer(() => {
  useEffect(() => {
    const fetchAndSetAboutData = async () => {
      const aboutData = await appStore.fetchAbout();
      if (aboutData) {
        setHistory(aboutData.history);
        setActivities(aboutData.activities);
        setAttendants(aboutData.attendants);
        setSubsidy(aboutData.subsidy);
        setCurrentImageUrl(aboutData.image);
        setExistingImages(aboutData.images || []);
      }
    };

    fetchAndSetAboutData();
  }, []);

  const [history, setHistory] = useState<string>("");
  const [activities, setActivities] = useState<string>("");
  const [attendants, setAttendants] = useState<string>("");
  const [subsidy, setSubsidy] = useState<string>("");
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Existing images URLs
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const handleHistoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHistory(event.target.value);
  };

  const handleActivitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setActivities(event.target.value);
  };

  const handleAttendantsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAttendants(event.target.value);
  };

  const handleSubsidyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubsidy(event.target.value);
  };

  const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
    const uploadPromises = imageFiles.map(async (file) => {
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      await uploadBytes(imageRef, file);
      return getDownloadURL(imageRef);
    });

    return Promise.all(uploadPromises);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImageFiles(filesArray);
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrlsToUpdate = existingImages;

      if (selectedImageFiles.length > 0) {
        const uploadedImageUrls = await uploadImages(selectedImageFiles);
        imageUrlsToUpdate = [...uploadedImageUrls];
      }

      const aboutCollection = collection(appStore.db, "about");
      const aboutDocRef = doc(aboutCollection, "2bzODuaQdvKzAcFh0Abw");

      const newAboutData = {
        history: history,
        activities: activities,
        attendants: attendants,
        subsidy: subsidy,
        images: imageUrlsToUpdate,
      };

      await updateDoc(aboutDocRef, newAboutData);

      console.log("已更新關於資訊");
      alert("已更新！");
    } catch (error) {
      console.error("更新失敗", error);
    }
  };
  const handleDeleteImage = async (imageToDelete: string) => {
    const updatedImages = existingImages.filter(
      (image) => image !== imageToDelete,
    );

    try {
      const aboutDocRef = doc(appStore.db, "about", "2bzODuaQdvKzAcFh0Abw");
      await updateDoc(aboutDocRef, { images: updatedImages });

      setExistingImages(updatedImages);
    } catch (error) {
      console.error("刪除圖片失敗", error);
    }
  };

  return (
    <div>
      <h1 className="mb-4 mt-28 flex justify-center text-3xl">
        地新引力的故事
      </h1>
      <div className="flex justify-center">
        <Textarea
          classNames={{
            base: "w-4/5 ",
            input: "resize-y min-h-[120px]",
          }}
          value={history}
          onChange={handleHistoryChange}
        />
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>舉辦過</p>
        <Input
          className="my-4 flex w-40 justify-center"
          value={activities}
          onChange={handleActivitiesChange}
        />
        <p>個活動</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>累積</p>
        <Input
          className="my-4 flex w-40 justify-center"
          value={attendants}
          onChange={handleAttendantsChange}
        />
        <p>位參加者</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>獲得</p>
        <Input
          className="my-4 flex w-40 justify-center"
          value={subsidy}
          onChange={handleSubsidyChange}
        />
        <p>萬元</p>
      </div>
      <div className="my-6 flex justify-center">
        <input
          type="file"
          multiple
          className="mb-4 "
          onChange={handleImageChange}
        ></input>
      </div>
      <div className=" flex items-center justify-center gap-4 ">
        {existingImages.map((imageUrl, index) => (
          <div key={index} className="relative">
            <img
              src={imageUrl}
              alt={`Image ${index}`}
              className="h-60 w-auto overflow-hidden rounded-md"
            />
            <button
              className="absolute right-0 top-0 m-1 rounded-full border bg-white p-1 text-white"
              onClick={() => handleDeleteImage(imageUrl)}
            >
              <div className="h-8 w-8 cursor-pointer bg-[url('/trash.png')] bg-contain" />
            </button>
          </div>
        ))}
      </div>
      <div className="my-6 flex justify-center ">
        <Button onClick={handleSubmit} className="bg-stone-800">
          <p className="text-white">更新</p>
        </Button>
      </div>
    </div>
  );
});

export default AdminAbout;
