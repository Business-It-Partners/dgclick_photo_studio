"use client";

// DG Click — div 4, "Our services". Split layout, click-driven (no scroll-scrub):
//   • LEFT half  — the LABEL for the active image (service name + one line + CTA),
//     over a subtle left grey wash.
//   • RIGHT half — the active photo in a square frame (matches the 2048² source).
//   • BOTTOM cards — the thumbnails of the OTHER services; clicking one GROWS it
//     into the right-hand frame (shared-element morph via framer `layoutId`),
//     the strip rotates, and the left label swaps line-by-line.
// transform/opacity only; reduced-motion = calm crossfade, no rise/morph.
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERIF, SANS, COLORS, GUTTER, withAlpha, eyebrow } from "@/lib/theme";
import { EASE_MECHANICAL } from "@/lib/motionTokens";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { openBooking } from "@/lib/booking";

const IMG = "/photo_shoot";
const ACCENT = COLORS.accent; // DG Click Studio-Red (was reference gold)
// Matches the white studio backdrop of the /photo_shoot images (sampled corner
// ≈ srgb(252,252,252)) so the photo blends into the section.
const BLEND = "#FCFCFC";

const BAR = 2.6; // seconds — top progress bar timeline (pacing affordance)
const MORPH = 0.9; // seconds — thumbnail → frame grow
const EASE = EASE_MECHANICAL;

type Slide = { img: string; label: string; sub: string; desc: string };

const HEADING = "Our services";

// Service slides — the SAME six shoot types as the div-3 constellation, same
// order. `label` is the big left-half heading; `desc` is its one line.
const SLIDES: Slide[] = [
  { img: `${IMG}/weeding_shoot.jpeg`,  label: "Weddings",              sub: "Mandap to last dance", desc: "From the mandap to the last dance — the day two families become one, held in light." },
  { img: `${IMG}/festival_shoot.jpeg`, label: "Teej & Festivals",      sub: "Colour & devotion",    desc: "The red of Teej, the gold of Dashain — the colour and devotion of a Nepali festival, kept." },
  { img: `${IMG}/bab_shower.jpeg`,     label: "Baby Showers",          sub: "Before the arrival",   desc: "The glow before the arrival — soft, joyful frames for the months of waiting." },
  { img: `${IMG}/professional.jpeg`,   label: "Corporate & Portraits", sub: "Confident & clean",    desc: "Clean, confident portraits and team frames that carry your professional story." },
  { img: `${IMG}/pasni.jpeg`,          label: "Pasni & Newborn",       sub: "First milestones",     desc: "First rice, first laugh, first steps — the milestones of a new life, gently captured." },
  { img: `${IMG}/school_shoot.jpeg`,   label: "School & +2 Batch",     sub: "Class of the year",    desc: "Batch portraits and farewells your whole cohort will keep for years." },
];
const N = SLIDES.length;

function useCompact() {
  const [c, setC] = useState(false);
  useEffect(() => {
    const f = () => setC(window.innerWidth <= 900);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return c;
}

export default function ServiceSlider() {
  const [active, setActive] = useState(0);
  const [prevImg, setPrevImg] = useState(SLIDES[0].img);
  const [morphing, setMorphing] = useState(false);
  const [started, setStarted] = useState(false); // gate the top progress bar
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const compact = useCompact();
  const reduced = useReducedMotionSafe();

  // Label fades in line-by-line on each change; old label fades out first.
  const txtContainer = {
    hidden: {},
    show: {
      transition: reduced
        ? { delayChildren: 0, staggerChildren: 0 }
        : { delayChildren: 0.15, staggerChildren: 0.12 },
    },
    exit: { opacity: 0, transition: { duration: reduced ? 0.15 : 0.3 } },
  };
  const txtLine = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.15 : 0.5, ease: "easeOut" },
    },
  };

  const change = (idx: number) => {
    if (idx === active) return;
    setPrevImg(SLIDES[active].img);
    setActive(idx);
    setStarted(true);
    if (!reduced) {
      setMorphing(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMorphing(false), MORPH * 1000 + 40);
    }
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const go = (dir: number) => change((active + dir + N) % N);
  const s = SLIDES[active];

  // The strip shows every service EXCEPT the active one (it's grown into the
  // frame). Clicking morphs that thumb in and rotates the previous one back.
  const others = SLIDES.map((_, i) => i).filter((i) => i !== active);

  return (
    // Normal-flow full-viewport section. (Was a 200vh sticky pin from the retired
    // scroll-scrub engine — that "held" the page since the slider is click-driven,
    // not scroll-driven. Removed so it scrolls naturally like every other section.)
    <section
      id="services-slider"
      aria-label="Our services"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: 620,
        overflow: "hidden",
        background: BLEND,
      }}
    >
        {/* subtle left→right wash — a little grey-black on the left fading to
            white toward the image. Light touch (not a scrim); text stays dark. */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: `linear-gradient(to right, ${withAlpha(COLORS.ink, 0.16)} 0%, ${withAlpha(COLORS.ink, 0.06)} 32%, ${withAlpha(COLORS.ink, 0)} 60%)`,
          }}
        />

        {/* resting track — a quiet red rail, always present (pacing affordance) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: withAlpha(ACCENT, 0.18),
            zIndex: 7,
            pointerEvents: "none",
          }}
        />
        {/* top progress bar — depletes after each change. */}
        {started && (
          <motion.div
            key={`bar-${active}`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: BAR, ease: "linear" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: ACCENT,
              transformOrigin: "left",
              zIndex: 8,
            }}
          />
        )}

        {/* main split — LEFT label / RIGHT image */}
        <div
          style={{
            position: "relative",
            zIndex: 6,
            height: "100%",
            maxWidth: 1640,
            margin: "0 auto",
            padding: `clamp(64px, 10vh, 104px) ${GUTTER} clamp(40px, 6vh, 64px)`,
            display: "flex",
            flexDirection: compact ? "column" : "row",
            alignItems: "center",
            gap: compact ? "clamp(20px, 4vh, 36px)" : "clamp(40px, 5vw, 96px)",
          }}
        >
          {/* ── LEFT — the label for the active image ── */}
          <div
            style={{
              flex: compact ? "0 0 auto" : "1 1 42%",
              width: compact ? "100%" : undefined,
              order: compact ? 2 : 1,
            }}
          >
            <div style={{ ...eyebrow(ACCENT), marginBottom: "1.4rem" }}>{HEADING}</div>

            <AnimatePresence mode="sync">
              <motion.div
                key={active}
                variants={txtContainer}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {/* the LABEL — the service name. Fraunces at a heavier optical
                    weight, tighter tracking and a closed line-height for a more
                    deliberate, editorial display voice. */}
                <motion.h2
                  variants={txtLine}
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: "clamp(2.9rem, 5.6vw, 5.8rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.035em",
                    color: COLORS.warmInk,
                    margin: 0,
                    textWrap: "balance",
                  }}
                >
                  {s.label}
                </motion.h2>
                {/* sub — small accent kicker under the label */}
                <motion.div
                  variants={txtLine}
                  style={{
                    fontFamily: SANS,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    marginTop: "1rem",
                  }}
                >
                  {s.sub}
                </motion.div>
                <motion.p
                  variants={txtLine}
                  style={{
                    fontFamily: SANS,
                    fontSize: "clamp(1.02rem, 1.4vw, 1.18rem)",
                    lineHeight: 1.7,
                    color: COLORS.mutedDark,
                    margin: "1.4rem 0 2.1rem",
                    maxWidth: "46ch",
                  }}
                >
                  {s.desc}
                </motion.p>
                <motion.div variants={txtLine}>
                  <motion.button
                    type="button"
                    onClick={openBooking}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    style={btnSolid}
                  >
                    BOOK A SESSION
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* arrows */}
            <div style={{ display: "flex", gap: 14, marginTop: "clamp(1.6rem, 4vh, 2.6rem)" }}>
              <ArrowBtn dir={-1} onClick={() => go(-1)} />
              <ArrowBtn dir={1} onClick={() => go(1)} />
            </div>
          </div>

          {/* ── RIGHT — the active image; thumbnails grow into this square ──
              Square frame to match the square (2048²) source → no crop. */}
          <div
            style={{
              flex: "0 0 auto",
              order: compact ? 1 : 2,
              position: "relative",
              width: compact ? "100%" : "auto",
              height: compact ? "auto" : "min(80vh, 800px)",
              aspectRatio: "1 / 1",
            }}
          >
            {/* settled image — ALWAYS STILL, no layoutId (can never shrink back).
                Shows the PREVIOUS image during a morph (the grow covers it). */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 1 }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${morphing ? prevImg : s.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>

            {/* transient grow overlay — exists ONLY during a morph. Grows from the
                clicked thumbnail (shared layoutId) to fill the square, then the
                still image above takes over. Its own overflow clips the photo. */}
            {morphing && (
              <motion.div
                key={active}
                layoutId={`slide-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: MORPH, ease: EASE, opacity: { duration: MORPH * 0.5, ease: "easeOut" } }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  overflow: "hidden",
                  backgroundImage: `url(${s.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}

            {/* bottom cards — TOP layer (above image + overlay + text), referenced
                to the column so they show fully and never clip. Active is grown
                into the frame, so the strip shows the OTHER five. */}
            <div
              style={{
                position: "absolute",
                zIndex: 9,
                bottom: compact ? 12 : 18,
                right: compact ? 12 : 0,
                left: compact ? 12 : "auto",
                display: "flex",
                gap: compact ? 8 : 12,
                justifyContent: compact ? "flex-start" : "flex-end",
                overflowX: compact ? "auto" : "visible",
                paddingTop: 10,
                scrollbarWidth: "none",
              }}
            >
              {others.map((idx) => {
                const t = SLIDES[idx];
                return (
                  <motion.button
                    key={t.img}
                    layoutId={`slide-${idx}`}
                    onClick={() => change(idx)}
                    aria-label={`Show ${t.label}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ y: -8 }}
                    transition={{ duration: MORPH, ease: EASE, opacity: { duration: 0.3 } }}
                    style={{
                      position: "relative",
                      flex: "0 0 auto",
                      width: compact ? 104 : "clamp(108px, 8.4vw, 150px)",
                      height: compact ? 134 : "clamp(140px, 11vw, 194px)",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      backgroundImage: `url(${t.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: "0 16px 38px rgba(0,0,0,0.45)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0) 58%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 12,
                        right: 8,
                        bottom: 10,
                        textAlign: "left",
                        fontFamily: SANS,
                      }}
                    >
                      <div
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: compact ? "0.66rem" : "0.74rem",
                          letterSpacing: "0.02em",
                          lineHeight: 1.15,
                        }}
                      >
                        {t.label}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
  );
}

const btnSolid: React.CSSProperties = {
  display: "inline-block",
  textDecoration: "none",
  fontFamily: SANS,
  fontWeight: 700,
  letterSpacing: "0.12em",
  fontSize: "0.82rem",
  color: COLORS.paper,
  background: ACCENT,
  border: "none",
  padding: "16px 30px",
  borderRadius: 4,
  cursor: "pointer",
};

const arrow: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  borderWidth: 1,
  borderStyle: "solid",
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

// SVG chevron button with a hover micro-animation (ring brightens, chevron
// nudges in its travel direction).
function ArrowBtn({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <motion.button
      aria-label={dir === -1 ? "Previous" : "Next"}
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.94 }}
      variants={{
        rest: {
          borderColor: "rgba(27,22,15,0.22)",
          backgroundColor: "rgba(27,22,15,0.04)",
        },
        hover: {
          borderColor: "rgba(27,22,15,0.5)",
          backgroundColor: "rgba(27,22,15,0.08)",
        },
      }}
      transition={{ duration: 0.22, ease: EASE }}
      style={{ ...arrow, color: COLORS.warmInk }}
    >
      <motion.span
        variants={{ hover: { x: dir * 3 } }}
        transition={{ duration: 0.22, ease: EASE }}
        style={{ display: "inline-flex" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {dir === -1 ? (
            <polyline points="15 18 9 12 15 6" />
          ) : (
            <polyline points="9 18 15 12 9 6" />
          )}
        </svg>
      </motion.span>
    </motion.button>
  );
}
