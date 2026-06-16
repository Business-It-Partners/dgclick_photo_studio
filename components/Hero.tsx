"use client";

// DG Click hero — three static planes, intro-choreographed with the loader:
//   • FAR  — the empty studio plate (background.jpeg), static.
//   • MID  — eyebrow + 3-line headline. Revealed AFTER the camera settles.
//   • NEAR — the camera (hero_2) drops from the top when the loader splash slides
//            away (INTRO_HANDOFF), settling into a gentle pendulum idle sway.
// The camera drop + text reveal wait for EntryCurtain's handoff so the two scenes
// hand off as one gesture. Reduced motion = everything shows at rest immediately.
// transform/opacity only.

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GUTTER, HEAVY, GROTESK, COLORS } from "@/lib/theme";
import { INTRO_HANDOFF, introHandoffDone } from "@/lib/intro";

const HERO_IMG = "/images/background.jpeg"; // empty studio cyclorama plate
const CAMERA_IMG = "/images/hero_2.png";
const LIGHT_STAND = "/images/light_stand.png"; // softbox on C-stand, parallaxes in from the right

const EASE_OUT = [0.22, 1, 0.36, 1] as const; // power4.out-ish — editorial

// A line of text that rises out of a mask when `active`. `develop` shifts
// charcoal → accent. MUST live at module scope: if it's defined inside Hero it
// gets a new identity on every render, so any later state change (e.g. the light
// stand sliding in) remounts it and the headline replays — a visible "blink".
function MaskLine({
  children,
  delay,
  develop = false,
  style,
  active,
  reduce,
}: {
  children: React.ReactNode;
  delay: number;
  develop?: boolean;
  style?: React.CSSProperties;
  active: boolean;
  reduce: boolean | null;
}) {
  return (
    <span style={{ display: "block", overflow: "hidden", paddingBottom: "0.1em" }}>
      <motion.span
        initial={reduce ? false : { y: "115%", color: develop ? COLORS.warmInk : undefined }}
        animate={
          reduce
            ? false
            : active
            ? { y: "0%", color: develop ? COLORS.accent : undefined }
            : { y: "115%", color: develop ? COLORS.warmInk : undefined }
        }
        transition={
          develop
            ? {
                y: { duration: 1.05, ease: EASE_OUT, delay },
                color: { duration: 0.9, ease: "easeOut", delay: delay + 1.0 },
              }
            : { duration: 1.05, ease: EASE_OUT, delay }
        }
        style={{ display: "block", ...style }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [cameraDrop, setCameraDrop] = useState(false); // NEAR camera descends
  const [showText, setShowText] = useState(false); // MID text + logo reveal
  const [showStand, setShowStand] = useState(false); // light stand parallaxes in
  const [compact, setCompact] = useState(false); // narrow-screen scaling for the stand

  // Intro chain off the loader handoff: camera drops → labels reveal → THEN the
  // light stand slides in from the right. Reduced motion shows everything at rest.
  useEffect(() => {
    if (reduce) {
      setCameraDrop(true);
      setShowText(true);
      setShowStand(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const start = () => {
      setCameraDrop(true);
      // after the slow camera settles → reveal labels → then slide the stand in
      timers.push(setTimeout(() => setShowText(true), 2500));
      timers.push(setTimeout(() => setShowStand(true), 3200));
    };
    if (introHandoffDone()) start();
    else window.addEventListener(INTRO_HANDOFF, start, { once: true });
    return () => {
      window.removeEventListener(INTRO_HANDOFF, start);
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  // narrow-screen detection — scale the stand down so it never covers the labels
  useEffect(() => {
    const f = () => setCompact(window.innerWidth <= 820);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  return (
    <section
      id="top"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: COLORS.ink,
        overflow: "hidden",
      }}
    >
      {/* ── FAR plane — the studio (static) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* light overlay + radial vignette + bottom fade (all static) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "rgba(0,0,0,0.04)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "radial-gradient(120% 95% at 50% 42%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.28) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `linear-gradient(to top, ${COLORS.paper} 0%, rgba(243,241,236,0) 28%)`,
        }}
      />

      {/* ── light stand — slides in from the right AFTER the labels appear,
             settling where it stands in the original studio plate (hero_1) ── */}
      <motion.img
        src={LIGHT_STAND}
        alt=""
        aria-hidden
        initial={reduce ? false : { x: "75%", opacity: 0 }}
        animate={reduce ? false : showStand ? { x: "0%", opacity: 1 } : { x: "75%", opacity: 0 }}
        transition={{ duration: 1.5, ease: EASE_OUT }}
        style={{
          position: "absolute",
          right: compact ? "-10%" : "1%",
          bottom: 0,
          height: compact ? "46vh" : "min(90vh, 900px)",
          width: "auto",
          zIndex: 2,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* ── MID plane — eyebrow + 3-line headline on the left rail (revealed after camera) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: `0 ${GUTTER}`,
          zIndex: 2,
        }}
      >
        {/* eyebrow — red dot (shutter cue) + studio kicker */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={reduce ? false : showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "1.5rem",
            fontFamily: GROTESK,
            fontSize: "clamp(0.72rem, 0.95vw, 0.86rem)",
            fontWeight: 600,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: COLORS.accent,
          }}
        >
          <motion.span
            animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
            transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.accent, display: "inline-block", flexShrink: 0 }}
          />
          Photography Studio · Kathmandu, Nepal
        </motion.div>

        {/* line 1 — main heading: heavy Archivo, develops charcoal → red */}
        <h1
          style={{
            margin: 0,
            fontFamily: HEAVY,
            fontWeight: 800,
            fontSize: "clamp(3.75rem, 9.2vw, 8rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: COLORS.accent,
          }}
        >
          <MaskLine delay={0.05} develop active={showText} reduce={reduce}>
            Capture
          </MaskLine>
        </h1>

        {/* line 2 — "Your Moment": lighter weight, smaller */}
        <div
          style={{
            fontFamily: GROTESK,
            fontWeight: 500,
            fontSize: "clamp(1.5rem, 3.6vw, 2.9rem)",
            lineHeight: 1.05,
            letterSpacing: "0.01em",
            color: COLORS.warmInk,
            marginTop: "0.55rem",
          }}
        >
          <MaskLine delay={0.22} active={showText} reduce={reduce}>
            Your Moment
          </MaskLine>
        </div>

        {/* line 3 — slogan: smaller, lighter, muted */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={reduce ? false : showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
          style={{
            fontFamily: GROTESK,
            fontWeight: 400,
            fontSize: "clamp(1rem, 1.9vw, 1.3rem)",
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            margin: "1.4rem 0 0",
            maxWidth: "34ch",
            color: COLORS.warmInk,
            opacity: 0.65,
          }}
        >
          Stories told in light and shadow.
        </motion.p>
      </div>

      {/* ── NEAR plane — the camera: drops from the top on handoff, then idle sway */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", height: "82vh", transform: "translateX(-50%)" }}>
          {/* drop-in on the rope — starts when the loader splash slides away, lands
              (with a soft settle) as the splash clears the screen */}
          <motion.div
            style={{ height: "100%", transformOrigin: "top center" }}
            initial={reduce ? { y: "0%" } : { y: "-115%" }}
            animate={{ y: cameraDrop ? "0%" : "-115%" }}
            // slow, steady descent — paced 1:1 with the loader's slide so the
            // camera reads as PUSHING the splash down (no spring bounce).
            transition={reduce ? { duration: 0 } : { duration: 2.8, ease: [0.42, 0, 0.2, 1] }}
          >
            {/* pendulum: a gentle idle sway, begun once the camera has settled */}
            <motion.img
              src={CAMERA_IMG}
              alt="Camera hanging from a rope"
              animate={!reduce && cameraDrop ? { rotate: [0, 3.2, -2.4, 1.6, -1, 0.7, -0.7, 0.7] } : undefined}
              transition={
                !reduce && cameraDrop
                  ? {
                      duration: 9,
                      times: [0, 0.12, 0.26, 0.4, 0.54, 0.7, 0.85, 1],
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                      delay: 2.9,
                    }
                  : undefined
              }
              style={{
                height: "100%",
                width: "auto",
                transformOrigin: "top center",
                userSelect: "none",
                display: "block",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* brand logo — home top-left (revealed with the hero text) */}
      <motion.img
        src="/dgclick-logo.png"
        alt="DG Click — Photo Studio"
        initial={reduce ? false : { opacity: 0, y: -10 }}
        animate={reduce ? false : showText ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 }}
        style={{
          position: "absolute",
          top: "clamp(18px, 3.5vh, 34px)",
          left: GUTTER,
          height: "clamp(51px, 7.5vh, 69px)",
          width: "auto",
          zIndex: 6,
          filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.22))",
          userSelect: "none",
        }}
      />
    </section>
  );
}
