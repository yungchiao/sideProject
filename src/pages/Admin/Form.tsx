import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { appStore } from "../../AppStore";

const Form: React.FC = observer(() => {
  useEffect(() => {
    appStore.fetchAdmin();
  }, []);
  const handleDelete = (id: any) => {
    appStore.deleteAdmin(id);
  };
  return (
    <div>
      {appStore.admins.map((admin) => (
        <div key={admin.id} className="mx-auto mt-4  rounded-lg border p-2">
          <h3>{admin.name}</h3>
          <img src={admin.images} className="h-auto w-40" />
          <div
            className="z-30 h-4 w-4 cursor-pointer bg-[url('./src/pages/Admin/trash.png')] "
            onClick={() => handleDelete(admin.id)}
          ></div>
        </div>
      ))}
    </div>
  );
});

export default Form;
