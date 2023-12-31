import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { appStore } from "../../AppStore";
import ActivityModal from "../../components/ModalDetail";
import { Admin, CartItem } from "../../type";
import { CalendarEvent } from "../../type.ts";
const Calendar: React.FC = observer(() => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

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
        latitude: selectedAdmin.latitude,
        longitude: selectedAdmin.longitude,
      };

      const userEmail = appStore.currentUserEmail;
      if (userEmail) {
        appStore.newCart(userEmail, cartItem);
        toast.success("加入訂單成功！");
      } else {
        toast.error("用戶未登入");
      }
    } else {
      toast.error("請選擇數量");
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
    <div className=" flex h-full w-full items-center justify-center gap-10 sm:flex-col md:flex-col lg:flex-col xl:flex-row">
      {showPartialInfo && selectedAdmin && (
        <div className="mb-4 px-0 sm:px-14">
          <div className="mb-10 flex border-b-large sm:flex-col sm:px-4 md:flex-row">
            <h1 className="mb-4 flex justify-center  text-3xl">EVENT</h1>
            <h1 className="mb-2 flex justify-center  text-3xl">
              這是什麼活動呢？
            </h1>
          </div>
          <div className="flex gap-5" onClick={() => setIsModalOpen(true)}>
            <div className="grid content-between">
              <div>
                <h3 className="mb-2 font-bold sm:text-sm md:text-base">
                  {selectedAdmin.name}
                </h3>
                <p className="sm:text-sm md:text-base">
                  {selectedAdmin.startTime?.toDate()?.toLocaleString()}
                </p>
                <p className="sm:text-sm md:text-base">
                  {selectedAdmin.endTime?.toDate()?.toLocaleString()}
                </p>
              </div>
              <div className="flex h-8 w-auto cursor-pointer justify-center rounded-full border-2 border-stone-600 bg-white transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                <p className="sm:text-sm sm:leading-8 md:text-base md:leading-8">
                  點擊查看詳情
                </p>
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
        <div
          className="background-cover bg-black/20"
          onClick={toggleModal}
        ></div>
      )}
      {isModalOpen && selectedAdmin && (
        <ActivityModal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          selectedAdmin={selectedAdmin}
          quantity={quantity}
          setQuantity={setQuantity}
          handleSignUp={handleSignUp}
        />
      )}
      <div className="mx-12 flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border p-3 text-sm shadow-xl sm:w-4/5 md:relative lg:w-1/2">
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
