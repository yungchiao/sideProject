import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
const Calendar: React.FC = () => {
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

    const eventsData = eventsSnapshot.docs.map((doc) => {
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
  return (
    <div className="w-200 mt-40">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
};

export default Calendar;
