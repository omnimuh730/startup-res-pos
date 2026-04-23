import { useState } from "react";
import { set, addDays } from "date-fns";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { OrderSummary, PaymentMethod, ChatContainer, ChatInput, CalendarGrid, Button, type OrderItem, type PaymentCard, type ChatMessage, type CalendarEvent } from "../ds";

const mockOrderItems: OrderItem[] = [
  { id: "1", name: "Margherita Pizza", price: 18.5, quantity: 1, note: "Extra cheese" },
  { id: "2", name: "Caesar Salad", price: 12.0, quantity: 2 },
  { id: "3", name: "Tiramisu", price: 9.0, quantity: 1 },
  { id: "4", name: "Sparkling Water", price: 3.5, quantity: 2 },
];

const mockCards: PaymentCard[] = [
  { id: "1", brand: "visa", last4: "4242", expiry: "12/26", isDefault: true, holderName: "John Doe" },
  { id: "2", brand: "mastercard", last4: "8888", expiry: "03/27", holderName: "John Doe" },
  { id: "3", brand: "amex", last4: "1234", expiry: "09/25" },
];

const mockMessages: ChatMessage[] = [
  { id: "1", content: "Hi! I'm interested in your beach house listing. Is it available next weekend?", sender: "other", senderName: "Sarah", timestamp: "2:30 PM", status: "read" },
  { id: "2", content: "Hi Sarah! Yes, the beach house is available next weekend. Would you like to book it?", sender: "user", timestamp: "2:32 PM", status: "read" },
  { id: "3", content: "That would be great! How many guests can it accommodate?", sender: "other", senderName: "Sarah", timestamp: "2:33 PM" },
  { id: "4", content: "It comfortably fits 6 guests with 3 bedrooms. Perfect for a small group!", sender: "user", timestamp: "2:35 PM", status: "delivered" },
  { id: "5", content: "Perfect! I'll go ahead and book it. Is there parking available?", sender: "other", senderName: "Sarah", timestamp: "2:36 PM" },
];

// Realistic reservation data spanning multiple days & tables
const today = new Date();
const d = (dayOffset: number, hour: number, min: number = 0) =>
  set(addDays(today, dayOffset), { hours: hour, minutes: min, seconds: 0 });

const mockReservationEvents: CalendarEvent[] = [
  // Today
  { id: "r1", date: d(0, 17, 30), endDate: d(0, 19, 30), title: "Brennen Weber", guests: 3, table: "A1", status: "confirmed" },
  { id: "r2", date: d(0, 18, 0), endDate: d(0, 20, 0), title: "Lisa Chen", guests: 2, table: "A2", status: "arrived" },
  { id: "r3", date: d(0, 17, 0), endDate: d(0, 19, 0), title: "Nina Patel", guests: 4, table: "A3", status: "confirmed" },
  { id: "r4", date: d(0, 19, 0), endDate: d(0, 21, 30), title: "Johann Garner", guests: 4, table: "B1", status: "left-message" },
  { id: "r5", date: d(0, 18, 30), endDate: d(0, 20, 30), title: "Katarina Higgins", guests: 1, table: "C1", status: "confirmed" },
  { id: "r6", date: d(0, 16, 0), endDate: d(0, 17, 30), title: "Amy Torres", guests: 2, table: "C2", status: "arrived" },
  { id: "r7", date: d(0, 16, 30), endDate: d(0, 18, 30), title: "Marco Ruiz", guests: 4, table: "C3", status: "confirmed" },
  { id: "r8", date: d(0, 20, 0), endDate: d(0, 22, 0), title: "Gale Matthews", guests: 2, table: "Q1", status: "requested" },
  { id: "r9", date: d(0, 19, 0), endDate: d(0, 20, 30), title: "Oliver Stone", guests: 2, table: "P1", status: "confirmed" },
  { id: "r10", date: d(0, 19, 30), endDate: d(0, 21, 0), title: "Emma Wilson", guests: 4, table: "P2", status: "arrived" },
  { id: "r11", date: d(0, 20, 30), endDate: d(0, 22, 30), title: "Frank Lopez", guests: 3, table: "BR1", status: "no-show" },
  // Tomorrow
  { id: "r12", date: d(1, 18, 0), endDate: d(1, 20, 0), title: "Sophie Turner", guests: 2, table: "A1", status: "confirmed" },
  { id: "r13", date: d(1, 19, 30), endDate: d(1, 21, 30), title: "James Lee", guests: 6, table: "Q1", status: "requested" },
  { id: "r14", date: d(1, 17, 0), endDate: d(1, 19, 0), title: "Anna Kim", guests: 4, table: "C3", status: "confirmed" },
  // Day after tomorrow
  { id: "r15", date: d(2, 18, 30), endDate: d(2, 20, 0), title: "David Park", guests: 3, table: "B1", status: "confirmed" },
  { id: "r16", date: d(2, 19, 0), endDate: d(2, 21, 0), title: "Maria Garcia", guests: 2, table: "BR2", status: "left-message" },
  // Past days
  { id: "r17", date: d(-1, 19, 0), endDate: d(-1, 21, 0), title: "Past Reservation", guests: 4, table: "A3", status: "arrived" },
  { id: "r18", date: d(-2, 18, 0), endDate: d(-2, 20, 0), title: "Earlier Booking", guests: 2, table: "C1", status: "no-show" },
  // Next week
  { id: "r19", date: d(5, 18, 0), endDate: d(5, 20, 0), title: "Weekend Party", guests: 8, table: "Q1", status: "confirmed" },
  { id: "r20", date: d(7, 19, 30), endDate: d(7, 21, 30), title: "Birthday Dinner", guests: 6, table: "A3", status: "requested" },
];

// Add month-view compatible time labels
const calendarEvents: CalendarEvent[] = mockReservationEvents.map((e) => ({
  ...e,
  time: `${e.date.getHours() > 12 ? e.date.getHours() - 12 : e.date.getHours()}:${String(e.date.getMinutes()).padStart(2, "0")} ${e.date.getHours() >= 12 ? "PM" : "AM"}`,
}));

export function MacroSection() {
  const [orderItems, setOrderItems] = useState(mockOrderItems);
  const [selectedCard, setSelectedCard] = useState("1");
  const [chatMessages, setChatMessages] = useState(mockMessages);
  const [chatInput, setChatInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleQuantityChange = (id: string, qty: number) => {
    if (qty === 0) {
      setOrderItems((items) => items.filter((i) => i.id !== id));
    } else {
      setOrderItems((items) => items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    }
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: text,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      status: "sent",
    };
    setChatMessages((msgs) => [...msgs, newMsg]);
    setChatInput("");
  };

  return (
    <SectionWrapper
      id="macro-ds"
      title="Macro Components"
      description="Domain-specific, complex reusable components: Reservation Calendar (daily/weekly/monthly), Order Summary, Payment Methods, and Chat."
    >
      {/* Calendar — Primary showcase */}
      <ComponentCard title="Reservation Calendar — Day / Week / Month Views">
        <p className="text-[0.75rem] text-muted-foreground mb-4">
          Full-featured reservation system with table slots, status indicators, and three view modes.
          The <strong>Day</strong> view shows an OpenTable-style timeline with tables as rows and time as columns.
        </p>
        <CalendarGrid
          events={calendarEvents}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onEventClick={(e) => alert(`Reservation: ${e.title}\nGuests: ${e.guests || "—"}\nTable: ${e.table || "—"}\nStatus: ${e.status || "confirmed"}`)}
          onNewBooking={() => alert("Open new booking form")}
          view="day"
        />
      </ComponentCard>

      {/* Order Summary */}
      <ComponentCard title="Order Summary / Shopping Cart">
        <div className="max-w-sm">
          <OrderSummary
            items={orderItems}
            onQuantityChange={handleQuantityChange}
            onRemove={(id) => setOrderItems((items) => items.filter((i) => i.id !== id))}
            deliveryFee={4.99}
            tip={5}
            discount={3}
            footer={
              <Button variant="primary" fullWidth>
                Place Order
              </Button>
            }
          />
        </div>
      </ComponentCard>

      {/* Payment Methods */}
      <ComponentCard title="Payment Methods">
        <div className="max-w-md">
          <PaymentMethod
            cards={mockCards}
            selected={selectedCard}
            onSelect={setSelectedCard}
            onAddNew={() => {}}
          />
        </div>
      </ComponentCard>

      {/* Chat */}
      <ComponentCard title="Messaging / Chat">
        <div className="max-w-md border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary/30">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[0.75rem]">S</div>
            <div>
              <p className="text-[0.8125rem]">Sarah Johnson</p>
              <p className="text-[0.625rem] text-muted-foreground">Online</p>
            </div>
          </div>
          <div className="p-4 max-h-80 overflow-y-auto bg-background">
            <ChatContainer messages={chatMessages} />
          </div>
          <ChatInput
            value={chatInput}
            onChange={setChatInput}
            onSend={handleSendMessage}
          />
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}