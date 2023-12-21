import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { Admin } from "../../type";
import Detail from "../Home/Detail";

interface ActivityModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  selectedAdmin: Admin | null;
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
