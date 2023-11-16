import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

function Calendar() {
  return (
    <div className="w-200 h-200 mt-20">
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
}

export default Calendar;
