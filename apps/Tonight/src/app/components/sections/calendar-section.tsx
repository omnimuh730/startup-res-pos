import { useState, useRef } from "react";
import { set, addDays } from "date-fns";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { CalendarGrid, type CalendarEvent } from "../ds";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

// Realistic reservation data spanning multiple days & tables
const today = new Date();
const d = (dayOffset: number, hour: number, min: number = 0) =>
  set(addDays(today, dayOffset), { hours: hour, minutes: min, seconds: 0 });

const mockReservationEvents: CalendarEvent[] = [
  // Today
  { id: "r1", date: d(0, 20, 0), endDate: d(0, 21, 30), title: "Brennen Weber ×3", guests: 3, table: "A1", status: "confirmed" },
  { id: "r2", date: d(0, 20, 0), endDate: d(0, 21, 0), title: "Lisa Chen ×2", guests: 2, table: "A2", status: "arrived" },
  { id: "r3", date: d(0, 20, 0), endDate: d(0, 20, 45), title: "Nina Patel ×1", guests: 1, table: "A3", status: "confirmed" },
  { id: "r4", date: d(0, 21, 0), endDate: d(0, 22, 30), title: "Johann Garner ×2", guests: 2, table: "B1", status: "left-message" },
  { id: "r5", date: d(0, 20, 0), endDate: d(0, 21, 0), title: "Katarina Higgins ×1", guests: 1, table: "C1", status: "confirmed" },
  { id: "r6", date: d(0, 22, 0), endDate: d(0, 23, 30), title: "Gale Matthews ×5", guests: 5, table: "Q1", status: "requested" },
  { id: "r7", date: d(0, 21, 0), endDate: d(0, 22, 0), title: "Oliver Stone ×2", guests: 2, table: "P1", status: "confirmed" },
  { id: "r8", date: d(0, 20, 30), endDate: d(0, 21, 30), title: "Emma Wilson ×4", guests: 4, table: "P2", status: "arrived" },
  { id: "r9", date: d(0, 20, 30), endDate: d(0, 22, 0), title: "Frank Lopez ×3", guests: 3, table: "BR1", status: "no-show" },
  { id: "r10", date: d(0, 21, 30), endDate: d(0, 22, 30), title: "Amy Torres ×2", guests: 2, table: "BR2", status: "confirmed" },

  // Tomorrow
  { id: "r12", date: d(1, 18, 0), endDate: d(1, 20, 0), title: "Sophie Turner ×2", guests: 2, table: "A1", status: "confirmed" },
  { id: "r13", date: d(1, 19, 30), endDate: d(1, 21, 30), title: "James Lee ×6", guests: 6, table: "Q1", status: "requested" },
  { id: "r14", date: d(1, 17, 0), endDate: d(1, 19, 0), title: "Anna Kim ×4", guests: 4, table: "C3", status: "confirmed" },
  { id: "r15", date: d(1, 20, 0), endDate: d(1, 21, 30), title: "Robert Brown ×2", guests: 2, table: "C2", status: "arrived" },

  // Day after tomorrow
  { id: "r16", date: d(2, 18, 30), endDate: d(2, 20, 0), title: "David Park ×3", guests: 3, table: "B1", status: "confirmed" },
  { id: "r17", date: d(2, 19, 0), endDate: d(2, 21, 0), title: "Maria Garcia ×2", guests: 2, table: "BR2", status: "left-message" },
  { id: "r18", date: d(2, 20, 0), endDate: d(2, 22, 0), title: "Lucas Martin ×4", guests: 4, table: "A3", status: "confirmed" },

  // Past days
  { id: "r19", date: d(-1, 19, 0), endDate: d(-1, 21, 0), title: "Past Reservation ×4", guests: 4, table: "A3", status: "arrived" },
  { id: "r20", date: d(-2, 18, 0), endDate: d(-2, 20, 0), title: "Earlier Booking ×2", guests: 2, table: "C1", status: "no-show" },

  // Next week
  { id: "r21", date: d(5, 18, 0), endDate: d(5, 20, 0), title: "Weekend Party ×8", guests: 8, table: "Q1", status: "confirmed" },
  { id: "r22", date: d(7, 19, 30), endDate: d(7, 21, 30), title: "Birthday Dinner ×6", guests: 6, table: "A3", status: "requested" },
  { id: "r23", date: d(6, 20, 0), endDate: d(6, 22, 0), title: "Family Gathering ×5", guests: 5, table: "P2", status: "confirmed" },

  // More varied times
  { id: "r24", date: d(3, 12, 0), endDate: d(3, 13, 30), title: "Lunch Reservation ×2", guests: 2, table: "C1", status: "confirmed" },
  { id: "r25", date: d(4, 13, 30), endDate: d(4, 15, 0), title: "Business Lunch ×4", guests: 4, table: "B1", status: "confirmed" },
  { id: "r26", date: d(8, 19, 0), endDate: d(8, 20, 30), title: "Anniversary ×2", guests: 2, table: "A1", status: "requested" },
];

// Add month-view compatible time labels
const calendarEvents: CalendarEvent[] = mockReservationEvents.map((e) => ({
  ...e,
  time: `${e.date.getHours() > 12 ? e.date.getHours() - 12 : e.date.getHours()}:${String(e.date.getMinutes()).padStart(2, "0")} ${e.date.getHours() >= 12 ? "PM" : "AM"}`,
}));

export function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleNewBooking = () => {
    alert("New booking modal would open here!");
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    alert(`Event: ${event.title}\nTable: ${event.table}\nGuests: ${event.guests}\nStatus: ${event.status}`);
  };

  return (
    <SectionWrapper
      id="calendar"
      title="Calendar View"
      description="Full-featured reservation calendar with day, week, and month views. Built like Google Calendar with timeline display, table allocation, and booking status tracking."
    >
      <ComponentCard title="Reservation Calendar">
        <p className="text-[0.75rem] text-muted-foreground mb-4">
          Switch between <strong>Month</strong>, <strong>Week</strong>, and <strong>Day</strong> views.
          The day view shows a timeline with tables on the left and hourly slots, perfect for restaurant reservations or appointment scheduling.
        </p>

        <CalendarGrid
          events={calendarEvents}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onEventClick={handleEventClick}
          onNewBooking={handleNewBooking}
        />

        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <p className="text-[0.75rem] text-muted-foreground mb-2"><strong>Features:</strong></p>
          <ul className="text-[0.75rem] text-muted-foreground space-y-1 ml-4 list-disc">
            <li><strong>Day View:</strong> Timeline with tables/resources on left, time slots horizontally</li>
            <li><strong>Week View:</strong> 7-day grid with hourly slots and current time indicator</li>
            <li><strong>Month View:</strong> Traditional month calendar with event badges</li>
            <li><strong>Status Tracking:</strong> Color-coded by status (Confirmed, Arrived, Requested, etc.)</li>
            <li><strong>Interactive:</strong> Click events to view details, navigate dates, create new bookings</li>
            <li><strong>Responsive:</strong> Scrollable on smaller screens, full-width on desktop</li>
          </ul>
        </div>
      </ComponentCard>

      <ComponentCard title="Usage Example">
        <div className="bg-muted/20 rounded-lg p-4">
          <pre className="text-[0.75rem] overflow-x-auto">
{`import { CalendarGrid, type CalendarEvent } from "./components/ds";

const events: CalendarEvent[] = [
  {
    id: "1",
    date: new Date(2026, 2, 16, 20, 0),
    endDate: new Date(2026, 2, 16, 21, 30),
    title: "John Doe ×4",
    guests: 4,
    table: "A1",
    status: "confirmed",
    time: "8:00 PM"
  }
];

<CalendarGrid
  events={events}
  onEventClick={(event) => console.log(event)}
  onNewBooking={() => console.log("New booking")}
/>`}
          </pre>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}
