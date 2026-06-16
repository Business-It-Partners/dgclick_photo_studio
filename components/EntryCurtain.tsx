"use client";

// DG Click — page-entry sequence, choreographed as a handoff with the hero:
//   1. Branded studio splash (loding.jpeg) holds while a 5s progress bar fills.
//   2. The whole splash then SLIDES DOWN off the bottom — and at that instant we
//      fire startIntroHandoff(), so the hero's hanging camera drops from the top
//      in the same gesture. As the splash clears, the camera reaches full hang.
//   3. The hero text reveals after (gated in Hero on the same signal).
// Fixed-length beat, never network-gated. Reduced-motion users skip it entirely
// (we still fire the handoff so the hero shows immediately).

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/theme";
import { startIntroHandoff } from "@/lib/intro";

const SPLASH = "/loding.jpeg"; // branded studio loading splash (DG Click wordmark baked in)
const PROGRESS_MS = 5000; // horizontal progress bar fills over 5s
const SLIDE_MS = 2800; // splash slide-down, paced 1:1 with the hero camera drop
                       // so the slowly-descending camera reads as PUSHING it down

export default function EntryCurtain() {
  const [mounted, setMounted] = useState(true);
  const [shown, setShown] = useState(false); // splash + bar faded in
  const [sliding, setSliding] = useState(false); // handoff: slide down

  useEffect(() => {
    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduced) {
      startIntroHandoff(); // let the hero show at rest immediately
      setMounted(false);
      return;
    }

    document.body.style.overflow = "hidden"; // freeze the page under the curtain

    const t0 = setTimeout(() => setShown(true), 60); // splash + bar in
    // bar full → slide the splash down AND hand off to the hero camera in one beat
    const t1 = setTimeout(() => {
      setSliding(true);
      startIntroHandoff();
    }, PROGRESS_MS);
    const t2 = setTimeout(() => {
      document.body.style.overflow = "";
      setMounted(false);
    }, PROGRESS_MS + SLIDE_MS);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff", // matches the splash's bright studio — no flash before paint
        overflow: "hidden",
        transform: sliding ? "translateY(100%)" : "translateY(0)",
        transition: `transform ${SLIDE_MS}ms cubic-bezier(0.42, 0, 0.2, 1)`,
        willChange: "transform",
      }}
    >
      {/* full-bleed branded splash with a slow, subtle zoom-in (ken-burns) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SPLASH})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: shown ? 1 : 0,
          transform: `scale(${shown ? 1 : 1.07})`,
          transition: "opacity 0.6s ease, transform 5s ease",
        }}
      />

      {/* horizontal progress bar — fills over 5s, then the splash slides away */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(46px, 9vh, 88px)",
          transform: "translateX(-50%)",
          width: "min(420px, 62vw)",
          height: 4,
          borderRadius: 100,
          background: "rgba(0,0,0,0.12)",
          overflow: "hidden",
          opacity: shown && !sliding ? 1 : 0,
          transition: "opacity 0.5s ease",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "left center",
            transform: `scaleX(${shown ? 1 : 0})`,
            transition: `transform ${PROGRESS_MS}ms linear`,
            background: COLORS.accent,
            borderRadius: 100,
          }}
        />
      </div>
    </div>
  );
}
