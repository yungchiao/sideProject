import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React from "react";
const Calendar: React.FC = () => {
  return (
    <div className="w-200 mt-40">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[
          { title: "Event 1", date: "2023-11-01" },
          { title: "Event 2", date: "2023-11-02" },
        ]}
      />
    </div>
  );
};

export default Calendar;
