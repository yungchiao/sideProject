import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import Detail from "../Home/Detail";
// import { appStore } from "../../AppStore";
import { Timestamp } from "firebase/firestore";
import { observer } from "mobx-react-lite";

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
  place: string;
  longitude: string;
  latitude: string;
}

interface ActivityModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  selectedAdmin: Admin;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleSignUp: () => void;
}
const ActivityModal: React.FC<ActivityModalProps> = observer(
  ({
    isOpen,
    toggleModal,
    selectedAdmin,
    quantity,
    setQuantity,
    handleSignUp,
  }) => {
    if (!isOpen || !selectedAdmin) return null;

    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={toggleModal}
        className="fixed left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 transform gap-4 border border-b-[20px] border-b-green bg-white shadow-lg"
      >
        <ModalContent>
          <ModalBody>
            <Detail
              selectedAdmin={selectedAdmin}
              quantity={quantity}
              setQuantity={setQuantity}
              handleSignUp={handleSignUp}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  },
);

export default ActivityModal;
