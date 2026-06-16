"use client";

// DG Click — "Book a session" popup. UI ONLY: no backend, no network. On submit
// it shows a thank-you state. Mounted once globally in app/layout.tsx; opens
// when any CTA dispatches BOOKING_EVENT (see lib/booking.ts).
//   • warm-paper card, Studio-Red accent, Fraunces × Space Grotesk
//   • closes on backdrop click, Esc, or the ✕; body scroll locked while open
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERIF, SANS, GROTESK, COLORS, withAlpha } from "@/lib/theme";
import { useScrollLock } from "@/lib/useScrollLock";
import { BOOKING_EVENT } from "@/lib/booking";

const ACCENT = COLORS.accent;
const EASE = [0.22, 1, 0.36, 1] as const;

const SHOOTS = [
  "Not sure yet",
  "Weddings",
  "Teej & Festivals",
  "Baby Showers",
  "Corporate & Portraits",
  "Pasni & Newborn",
  "School & +2 Batch",
];

type Data = { name: string; phone: string; email: string; shoot: string; date: string; message: string };
const EMPTY: Data = { name: "", phone: "", email: "", shoot: SHOOTS[0], date: "", message: "" };

const labelStyle: React.CSSProperties = {
  fontFamily: GROTESK,
  fontSize: "0.7rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: withAlpha(COLORS.warmInk, 0.6),
  display: "block",
  marginBottom: "0.5rem",
};

const inputBase: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: "0.98rem",
  color: COLORS.warmInk,
  background: withAlpha(COLORS.warmInk, 0.03),
  border: `1px solid ${withAlpha(COLORS.warmInk, 0.18)}`,
  borderRadius: 6,
  padding: "0.8rem 0.95rem",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s ease, background 0.2s ease",
};

const focusAccent = {
  onFocus: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = ACCENT;
    e.currentTarget.style.background = withAlpha(ACCENT, 0.04);
  },
  onBlur: (e: React.FocusEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = withAlpha(COLORS.warmInk, 0.18);
    e.currentTarget.style.background = withAlpha(COLORS.warmInk, 0.03);
  },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function BookingModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Data>(EMPTY);
  const [sent, setSent] = useState(false);

  useScrollLock(open);

  // Open on the global event; close + reset on Esc.
  useEffect(() => {
    const onOpen = () => {
      setSent(false);
      setData(EMPTY);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(BOOKING_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(BOOKING_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const set =
    (key: keyof Data) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true); // UI only — no network
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="booking-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Book a session"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 40px)",
            // Warm charcoal scrim (not pure ink) at a lighter alpha so the page
            // reads through as a dimmed frost rather than a flat black void —
            // especially over the dark sections where pure ink @0.6 went black.
            background: withAlpha(COLORS.warmInk, 0.48),
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            key="booking-panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.34, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              maxHeight: "90vh",
              background: COLORS.paper,
              borderRadius: 18,
              boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* close ✕ - anchored absolutely to the outer panel so it never scrolls */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: `1px solid ${withAlpha(COLORS.warmInk, 0.18)}`,
                background: COLORS.paper, // solid background so scrolling content doesn't bleed behind it
                color: COLORS.warmInk,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                lineHeight: 1,
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* scrollable inner viewport */}
            <div
              className="booking-panel-scroll"
              // Lenis hijacks page wheel events (and keeps preventing default even
              // after lenis.stop()), which otherwise swallows this panel's native
              // overflow scroll. data-lenis-prevent tells Lenis to ignore wheel/
              // touch inside here so the panel scrolls on its own.
              data-lenis-prevent
              style={{
                width: "100%",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                padding: "clamp(26px, 4vw, 44px)",
              }}
            >
              {/* Chrome / Brave / Safari: hide the scrollbar while keeping scroll */}
              <style>{`.booking-panel-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }`}</style>

            {sent ? (
              // ── thank-you state ──
              <div style={{ textAlign: "center", padding: "1.5rem 0 0.5rem" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    margin: "0 auto 1.4rem",
                    borderRadius: "50%",
                    background: withAlpha(ACCENT, 0.12),
                    color: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  ✓
                </div>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                    letterSpacing: "-0.02em",
                    color: COLORS.warmInk,
                    margin: 0,
                  }}
                >
                  Thank you, {data.name.split(" ")[0] || "friend"}.
                </h2>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: "1.02rem",
                    lineHeight: 1.7,
                    color: COLORS.mutedDark,
                    margin: "1rem auto 2rem",
                    maxWidth: "36ch",
                  }}
                >
                  Your request is in. We&rsquo;ll reach out within a day to lock in
                  your session.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    fontFamily: GROTESK,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    color: COLORS.paper,
                    background: ACCENT,
                    border: "none",
                    padding: "0.95rem 2.2rem",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              // ── form state ──
              <>
                <div
                  style={{
                    fontFamily: GROTESK,
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    marginBottom: "0.8rem",
                  }}
                >
                  Book a session
                </div>
                <h2
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                    lineHeight: 1.04,
                    letterSpacing: "-0.025em",
                    color: COLORS.warmInk,
                    margin: "0 0 0.6rem",
                  }}
                >
                  Let&rsquo;s capture your moment.
                </h2>
                <p
                  style={{
                    fontFamily: SANS,
                    fontSize: "0.96rem",
                    lineHeight: 1.6,
                    color: COLORS.mutedDark,
                    margin: "0 0 1.8rem",
                    maxWidth: "44ch",
                  }}
                >
                  Tell us about your shoot and we&rsquo;ll get back to you within a day.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Field label="Name">
                      <input required value={data.name} onChange={set("name")} style={inputBase} {...focusAccent} placeholder="Your name" />
                    </Field>
                    <Field label="Phone / WhatsApp">
                      <input required value={data.phone} onChange={set("phone")} style={inputBase} {...focusAccent} placeholder="98XXXXXXXX" />
                    </Field>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <Field label="Shoot type">
                      <select value={data.shoot} onChange={set("shoot")} style={{ ...inputBase, appearance: "none", cursor: "pointer" }} {...focusAccent}>
                        {SHOOTS.map((sh) => (
                          <option key={sh} value={sh} style={{ color: COLORS.inkText }}>
                            {sh}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Preferred date">
                      <input value={data.date} onChange={set("date")} style={inputBase} {...focusAccent} placeholder="e.g. 14 June" />
                    </Field>
                  </div>

                  <Field label="Email (optional)">
                    <input type="email" value={data.email} onChange={set("email")} style={inputBase} {...focusAccent} placeholder="you@example.com" />
                  </Field>

                  <Field label="Tell us more">
                    <textarea value={data.message} onChange={set("message")} rows={4} style={{ ...inputBase, resize: "vertical" }} {...focusAccent} placeholder="The occasion, location, anything special…" />
                  </Field>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    style={{
                      fontFamily: GROTESK,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      fontSize: "0.82rem",
                      textTransform: "uppercase",
                      color: COLORS.paper,
                      background: ACCENT,
                      border: "none",
                      padding: "1.05rem 2rem",
                      borderRadius: 6,
                      cursor: "pointer",
                      marginTop: "0.2rem",
                    }}
                  >
                    Request my session
                  </motion.button>
                </form>
              </>
            )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
