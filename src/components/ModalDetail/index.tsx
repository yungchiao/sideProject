import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Admin } from "../../type";
import Detail from "./Detail";
interface ActivityModalProps {
  isOpen: boolean;
  toggleModal: (open: boolean) => void;
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
    useEffect(() => {
      if (isOpen) setQuantity(1);
    }, [isOpen, selectedAdmin?.id]);
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={toggleModal} // NextUI 會呼叫 toggleModal(open:boolean)
        className="fixed left-1/2 top-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 transform gap-4 border border-b-[20px] border-b-green bg-white shadow-lg"
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>
              <Detail
                key={selectedAdmin.id}
                selectedAdmin={selectedAdmin}
                quantity={quantity}
                setQuantity={setQuantity}
                handleSignUp={handleSignUp}
                onClose={onClose}
              />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    );
  },
);

export default ActivityModal;
