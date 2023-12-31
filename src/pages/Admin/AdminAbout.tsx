import { Input, Textarea } from "@nextui-org/react";
import { collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
export const storage = getStorage(appStore.app);
const AdminAbout: React.FC = observer(() => {
  useEffect(() => {
    const fetchAndSetAboutData = async () => {
      setIsLoading(true);
      try {
        const aboutData = await appStore.fetchAbout();
        if (aboutData) {
          setHistory(aboutData.history);
          setActivities(aboutData.activities);
          setAttendants(aboutData.attendants);
          setSubsidy(aboutData.subsidy);
          setExistingImages(aboutData.images || []);
          setImageDescriptions(
            aboutData.descriptions || aboutData.images.map(() => ""),
          );
        }
      } catch (error) {
        console.error("Error fetching about data: ", error);
      } finally {
        setIsLoading(false);
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
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);
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
    if (event.target.files && event.target.files.length > 0) {
      const totalImageCount = existingImages.length + event.target.files.length;

      if (totalImageCount > 5) {
        toast.error(
          `您最多只能上傳5張圖片。目前已有 ${existingImages.length} 張圖片。`,
        );
        return;
      }
      const filesArray = Array.from(event.target.files);
      setSelectedImageFiles(filesArray);
      const filePreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file),
      );
      setPreviewUrls(filePreviewUrls);
    } else {
      setSelectedImageFiles([]);
      setPreviewUrls([]);
    }
  };

  const handleSubmit = async () => {
    setIsUpdateLoading(true);
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
        descriptions: imageDescriptions,
      };

      await updateDoc(aboutDocRef, newAboutData);

      console.log("已更新關於資訊");
      toast.success("已更新！");
      setIsUpdateLoading(false);
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
  const [imageDescriptions, setImageDescriptions] = useState(
    existingImages.map(() => ""),
  );

  const handleDescriptionChange = (index: any, event: any) => {
    const newDescriptions = [...imageDescriptions];
    newDescriptions[index] = event.target.value;
    setImageDescriptions(newDescriptions);
  };
  return (
    <>
      {isLoading ? (
        <div className="grid justify-center rounded-md px-40 py-6 pt-40">
          <div className="spin-slow flex h-[90px] w-[90px] md:h-[150px] md:w-[150px] ">
            <img
              src="./gravity-logo.png"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-12 text-center">Loading中...</p>
        </div>
      ) : (
        <>
          <div className=" mx-auto w-4/5 pt-32">
            <div className="rounded-xl bg-white p-4">
              <h1 className=" flex justify-center pb-4 pt-6  text-3xl">
                地新引力的故事
              </h1>
              <div className="flex justify-center">
                <Textarea
                  maxLength={400}
                  classNames={{
                    base: "w-4/5 ",
                    input: "resize-y min-h-[120px]",
                  }}
                  value={history}
                  onChange={handleHistoryChange}
                />
              </div>
            </div>
            <div className="rounded-xl bg-white p-4">
              <div className="flex items-center justify-center gap-4">
                <p>舉辦過</p>
                <Input
                  type="number"
                  maxLength={15}
                  className="my-4 flex w-40 justify-center"
                  value={activities}
                  onChange={handleActivitiesChange}
                />
                <p>個活動</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <p>累積</p>
                <Input
                  type="number"
                  maxLength={15}
                  className="my-4 flex w-40 justify-center"
                  value={attendants}
                  onChange={handleAttendantsChange}
                />
                <p>位參加者</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <p>獲得</p>
                <Input
                  type="number"
                  maxLength={15}
                  className="my-4 flex w-40 justify-center"
                  value={subsidy}
                  onChange={handleSubsidyChange}
                />
                <p>萬元</p>
              </div>
            </div>
            <div className="container mx-auto my-8 flex justify-center ">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
              <label
                htmlFor="file-upload"
                className="fc-today-button cursor-pointer rounded-lg bg-brown px-4 py-2 font-bold text-white hover:bg-darkYellow"
              >
                選擇圖片
              </label>
            </div>
            <div className=" flex items-center justify-center gap-4">
              {previewUrls.map((url, index) => (
                <div className="relative  h-auto w-[240px] overflow-hidden rounded-md">
                  <img
                    key={index}
                    src={url}
                    alt={`Preview ${index}`}
                    className="h-60 w-full object-cover"
                  />
                  <button className="absolute right-0 top-0 m-1 rounded-full border bg-white p-1 text-white transition duration-200 hover:bg-stone-200">
                    <div className="h-8 w-8 cursor-pointer bg-[url('/trash.png')] bg-contain" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid items-center justify-center gap-4 md:flex ">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`Image ${index}`}
                    className="mt-4 h-60 w-auto overflow-hidden rounded-md object-cover"
                  />
                  <textarea
                    maxLength={100}
                    placeholder="圖片說明"
                    className="mt-8 h-[150px] max-h-[150px] min-h-[150px] w-full overflow-auto rounded-lg bg-white p-2"
                    value={imageDescriptions[index]}
                    onChange={(event) => handleDescriptionChange(index, event)}
                  />
                  <button
                    className="absolute right-0 top-0 m-1 rounded-full border bg-white p-1 text-white transition duration-200 hover:bg-stone-200"
                    onClick={() => handleDeleteImage(imageUrl)}
                  >
                    <div className="h-8 w-8 cursor-pointer bg-[url('/trash.png')] bg-contain" />
                  </button>
                </div>
              ))}
            </div>
            <div className=" mx-auto mb-10 mt-6 grid items-center justify-center text-center">
              <div>
                <GlobalButton
                  variant="green"
                  content="更新"
                  onClick={handleSubmit}
                />
                {isUpdateLoading && (
                  <div className="mt-6 flex justify-center gap-2">
                    <img
                      src="./gravity-logo.png"
                      className="spin-slow relative mx-auto flex h-[40px] w-[40px] object-cover"
                    />
                    <p className="flex items-center">更新中...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default AdminAbout;
