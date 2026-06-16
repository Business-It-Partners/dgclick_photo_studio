// UI-only "Book a session" modal trigger. Any CTA on the site calls
// openBooking(); the globally-mounted <BookingModal/> (in app/layout.tsx)
// listens for this event and opens. No backend — the form is UI only.
export const BOOKING_EVENT = "dgclick:open-booking";

export function openBooking() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BOOKING_EVENT));
  }
}
