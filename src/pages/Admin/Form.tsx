import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

interface FormProps {
  onActivitySelect: (activity: ActivityType) => void;
}

interface ActivityType {
  id: string;
  name: string;
  images: File;
  price: number;
  content: string;
  hashtags: {};
  position: string;
}

const Form: React.FC<FormProps> = ({ onActivitySelect }) => {
  useEffect(() => {
    appStore.fetchAdmin();
  }, []);

  const handleActivityClick = (activity: ActivityType) => {
    onActivitySelect(activity);
  };

  const handleDelete = (id: string) => {
    appStore.deleteAdmin(id);
  };

  return (
    <div>
      {appStore.admins.map((admin) => (
        <div key={admin.id} className="mx-auto mt-4 rounded-lg border p-2">
          <h3
            onClick={() => handleActivityClick(admin)}
            className="cursor-pointer"
          >
            {admin.name}
          </h3>
          <img src={admin.images} className="h-auto w-40" />
          <div
            className="h-4 w-4 cursor-pointer bg-[url('./src/pages/Admin/trash.png')]"
            onClick={() => handleDelete(admin.id)}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default observer(Form);
