import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  collection,
  getDocs,
  getFirestore,
  Timestamp,
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
    fetchEvents();
  }, []);
  useEffect(() => {
    appStore.fetchAdmin();
  }, []);
  useEffect(() => {
    setClosestEventAsSelected();
  }, [events]);
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
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [quantity, setQuantity] = useState(0);

  const handleEventClick = (clickInfo: any) => {
    const eventName = clickInfo.event.title;
    const selectedEventAdmin = appStore.admins.find(
      (admin) => admin.name === eventName,
    );

    if (selectedEventAdmin) {
      setSelectedAdmin(selectedEventAdmin);
      setDetailOpen(true);
    } else {
      console.error("找不到該活動");
      setSelectedAdmin(null);
      setDetailOpen(false);
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
        setDetailOpen(true);
      }
    }
  };

  return (
    <div className="mt-10 flex w-full justify-center gap-6">
      {isDetailOpen && selectedAdmin && (
        <Detail
          selectedAdmin={selectedAdmin}
          quantity={quantity}
          setQuantity={setQuantity}
          handleSignUp={handleSignUp}
        />
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
