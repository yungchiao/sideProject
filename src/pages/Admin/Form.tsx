import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import { GlobalButton } from "../../components/Button";
import { ActivityType } from "../../type";
interface FormProps {
  onActivitySelect: (activity: ActivityType) => void;
  onSearchLocationChange: (location: string) => void;
}

const Form: React.FC<FormProps> = ({
  onActivitySelect,
  onSearchLocationChange,
}) => {
  useEffect(() => {
    appStore.fetchAdmin();
  }, []);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const handleActivityClick = (activity: ActivityType) => {
    onActivitySelect(activity);
    onSearchLocationChange(`${activity.latitude}, ${activity.longitude}`);
  };

  const handleDelete = (id: string) => {
    setSelectedAdminId(id);

    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAdminId) {
      appStore.deleteAdmin(selectedAdminId);
      setSelectedAdminId(null);
    }
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };
  return (
    <div>
      {appStore.admins.map((admin) => (
        <div className="mt-2 flex items-center justify-between rounded-lg border p-4 px-5  lg:mt-4">
          <div key={admin.id}>
            <h3 className="mr-2  text-sm">{admin.name}</h3>
            <div className="mt-4 flex gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer self-end"
                onClick={() => handleDelete(admin.id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5 cursor-pointer self-end"
                onClick={() => handleActivityClick(admin)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </div>
          </div>
          <div className=" h-40 w-40 overflow-hidden rounded-md sm:h-20 sm:w-20 md:h-32 md:w-32">
            <img src={admin.images} className="h-full w-full object-cover" />
          </div>
        </div>
      ))}

      {showConfirmModal && (
        <>
          <div className="fixed left-1/2 top-1/2 z-40 grid h-[300px] w-1/4 -translate-x-1/2 -translate-y-1/2 transform place-content-center gap-6 rounded-lg border border-b-[20px] border-brown bg-white p-4 shadow-lg">
            <div className=" flex justify-center">
              <p>確定要刪除嗎？</p>
            </div>
            <div className=" flex justify-center gap-4">
              <GlobalButton
                variant="green"
                content="確定"
                onClick={handleConfirmDelete}
              />
              <GlobalButton
                variant="yellow"
                content="取消"
                onClick={handleCancelDelete}
              />
            </div>
          </div>
          <div className="background-cover"></div>
        </>
      )}
    </div>
  );
};

export default observer(Form);
