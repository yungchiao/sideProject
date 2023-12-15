import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Modal, ModalBody, ModalContent } from "@nextui-org/react";
import {
  Timestamp,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { appStore } from "../../AppStore";
import Detail from "../../components/Home/Detail";
const Calendar: React.FC = observer(() => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  interface CalendarEvent {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
  }

  const fetchEvents = async () => {
    const db = getFirestore();
    const eventsCollection = collection(db, "admin");
    const eventsSnapshot = await getDocs(eventsCollection);

    const eventsData: CalendarEvent[] = eventsSnapshot.docs.map((doc) => {
      const eventData = doc.data();

      const start = eventData.startTime?.toDate
        ? eventData.startTime.toDate()
        : new Date();

      const end = eventData.endTime?.toDate
        ? eventData.endTime.toDate()
        : new Date();

      return {
        title: eventData.name,
        start: start,
        end: end,
        allDay: false,
      };
    });

    setEvents(eventsData);
  };
  useEffect(() => {
    const fetchAdminsAndEvents = async () => {
      await appStore.fetchAdmin();
      await fetchEvents();
    };

    fetchAdminsAndEvents();
  }, []);

  useEffect(() => {
    if (appStore.admins.length > 0 && events.length > 0) {
      setClosestEventAsSelected();
    }
  }, [appStore.admins, events]);

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
  interface CartItem {
    name: string;
    quantity: number;
    price: number;
    id: string;
  }

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [showPartialInfo, setShowPartialInfo] = useState(false);
  const handleEventClick = (clickInfo: any) => {
    const eventName = clickInfo.event.title;
    const selectedEventAdmin = appStore.admins.find(
      (admin) => admin.name === eventName,
    );

    if (selectedEventAdmin) {
      setSelectedAdmin(selectedEventAdmin);
      setShowPartialInfo(true);
      setIsModalOpen(false);
    } else {
      console.error("找不到該活動");
      setSelectedAdmin(null);
      setShowPartialInfo(false);
    }
  };

  const handleSignUp = () => {
    if (selectedAdmin && quantity > 0) {
      const cartItem: CartItem = {
        name: selectedAdmin.name,
        quantity: quantity,
        price: selectedAdmin.price,
        id: selectedAdmin.id,
      };

      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.newCart(userEmail, cartItem);
        alert("加入訂單成功！");
      } else {
        alert("用戶未登入");
      }
    } else {
      alert("請選擇數量");
    }
  };
  const getClosestEventDate = (): Date => {
    const today = new Date();
    let closestDate = today;
    let minDiff = Infinity;

    events.forEach((event) => {
      const diff = Math.abs(event.start.getTime() - today.getTime());
      if (diff < minDiff) {
        closestDate = event.start;
        minDiff = diff;
      }
    });

    return closestDate;
  };

  const setClosestEventAsSelected = () => {
    let closestEvent: CalendarEvent | null = null;
    let minDiff = Infinity;
    const today = new Date();

    events.forEach((event) => {
      const diff = Math.abs(event.start.getTime() - today.getTime());
      if (diff < minDiff) {
        closestEvent = event;
        minDiff = diff;
      }
    });

    if (closestEvent) {
      const selectedEventAdmin = appStore.admins.find(
        (admin) => admin.name === (closestEvent as CalendarEvent).title,
      );
      if (selectedEventAdmin) {
        setSelectedAdmin(selectedEventAdmin);
        setShowPartialInfo(true);
      } else {
        setSelectedAdmin(null);
        setShowPartialInfo(false);
      }
    }
  };

  return (
    <div className="mt-10 flex h-full w-full items-center justify-center gap-20">
      {showPartialInfo && selectedAdmin && (
        <div>
          <h1 className="mb-10 flex justify-center border-b-large pb-5 text-3xl">
            EVENT 這是什麼活動呢？
          </h1>

          <div className="flex gap-5" onClick={() => setIsModalOpen(true)}>
            <div className="grid content-between">
              <div>
                <h3 className="mb-2 font-bold">{selectedAdmin.name}</h3>
                <p>{selectedAdmin.startTime?.toDate()?.toLocaleString()}</p>
                <p>{selectedAdmin.endTime?.toDate()?.toLocaleString()}</p>
              </div>
              <div className="flex h-8 w-auto cursor-pointer justify-center rounded-full border-2 border-stone-600 bg-white transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <p className="leading-8">點擊查看詳情</p>
              </div>
            </div>
            <div className="h-40 w-60 overflow-hidden rounded-lg">
              <img
                src={selectedAdmin.images}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="background-cover" onClick={toggleModal}></div>
      )}
      {isModalOpen && selectedAdmin && (
        <Modal
          isOpen={isModalOpen}
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
      )}

      <div className="calendar-bg">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={getClosestEventDate()}
          events={events}
          eventClick={(admin) => handleEventClick(admin)}
        />
      </div>
    </div>
  );
});

export default Calendar;
