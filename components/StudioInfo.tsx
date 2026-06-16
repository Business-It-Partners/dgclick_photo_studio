"use client";

// DG Click — studio-info / credibility band (sits where reviews used to).
// Editorial two-column: the studio name (the "Click" develops in Studio Red,
// the shutter cue) + a short line on the left; a confident stat stack on the
// right. Numbers reveal on scroll. transform/opacity only, reduced-motion safe.

import { motion, useReducedMotion } from "framer-motion";
import { SERIF, GROTESK, COLORS, withAlpha } from "@/lib/theme";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { v: "20+", l: "Years of experience" },
  { v: "24–72 hrs", l: "Delivery turnaround" },
  { v: "10k+", l: "Product shoots" },
];

export default function StudioInfo() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12%" },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section
      id="studio"
      style={{
        background: COLORS.paper,
        color: COLORS.warmInk,
        padding: "clamp(96px, 15vh, 180px) clamp(20px, 5vw, 64px)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "clamp(48px, 7vw, 110px)",
        }}
      >
        {/* ── left: identity ─────────────────────────────────────────────── */}
        <div style={{ flex: "1 1 420px", minWidth: 0 }}>
          {/* eyebrow */}
          <motion.div
            {...reveal(0)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.7rem",
              marginBottom: "1.6rem",
              fontFamily: GROTESK,
              fontSize: "clamp(0.7rem, 0.9vw, 0.82rem)",
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: COLORS.accent,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: COLORS.accent,
                display: "inline-block",
              }}
            />
            The Studio
          </motion.div>

          {/* studio logo — transparent PNG (replaces the "DG Click" text mark) */}
          <motion.img
            {...reveal(0.06)}
            src="/dgclick-logo.png"
            alt="DG Click"
            style={{
              display: "block",
              width: "clamp(220px, 30vw, 340px)",
              height: "auto",
              margin: 0,
            }}
          />
          <motion.div
            {...reveal(0.12)}
            style={{
              fontFamily: GROTESK,
              fontWeight: 600,
              fontSize: "clamp(1rem, 1.6vw, 1.35rem)",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: withAlpha(COLORS.warmInk, 0.7),
              marginTop: "0.9rem",
            }}
          >
            Photo Studio
          </motion.div>

          {/* supporting line */}
          <motion.p
            {...reveal(0.18)}
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)",
              lineHeight: 1.55,
              color: withAlpha(COLORS.warmInk, 0.62),
              margin: "1.8rem 0 0",
              maxWidth: "40ch",
            }}
          >
            Two decades behind the lens in Kathmandu — a studio built for
            products, portraits, and the moments families keep.
          </motion.p>
        </div>

        {/* ── right: stat stack ──────────────────────────────────────────── */}
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.l}
              {...reveal(0.12 + i * 0.1)}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "1.5rem",
                padding: "clamp(20px, 3vh, 30px) 0",
                borderTop:
                  i === 0
                    ? `1px solid ${withAlpha(COLORS.warmInk, 0.14)}`
                    : "none",
                borderBottom: `1px solid ${withAlpha(COLORS.warmInk, 0.14)}`,
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontSize: "clamp(2.6rem, 5vw, 4rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: COLORS.accent,
                  whiteSpace: "nowrap",
                }}
              >
                {s.v}
              </span>
              <span
                style={{
                  fontFamily: GROTESK,
                  fontWeight: 600,
                  fontSize: "clamp(0.74rem, 1vw, 0.86rem)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: withAlpha(COLORS.warmInk, 0.6),
                  textAlign: "right",
                  maxWidth: "12ch",
                }}
              >
                {s.l}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
