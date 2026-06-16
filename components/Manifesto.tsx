"use client";

// DG Click — div 2, "the why" manifesto. The emotional counter-beat to the
// bright hero: dark, slow, generous. Manifesto type on the LEFT; the 3D camera
// (right_side_camera.png) floats on the RIGHT, lens aimed back at the words,
// with a Studio-Red glow behind it. Reveals on scroll-into-view; only the
// camera keeps moving (a gentle levitation). Reduced-motion = calm & readable.

import { motion, useReducedMotion } from "framer-motion";
import { SERIF, GROTESK, COLORS } from "@/lib/theme";

const CAMERA = "/images/right_side_camera.png";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function Manifesto() {
  const reduce = useReducedMotion();

  // Scroll-into-view reveal preset (fires once).
  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  });

  return (
    <section
      id="about"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: COLORS.paper,
        color: COLORS.warmInk,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        scrollMarginTop: "80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1520,
          margin: "0 auto",
          padding: "clamp(120px, 17vh, 210px) clamp(28px, 5.5vw, 110px)",
          display: "flex",
          alignItems: "center",
          gap: "clamp(48px, 7vw, 130px)",
          flexWrap: "wrap",
        }}
      >
        {/* ── LEFT — the manifesto ── */}
        <div style={{ flex: "1 1 460px", minWidth: 300, maxWidth: 720 }}>
          {/* eyebrow */}
          <motion.div
            {...reveal(0)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              marginBottom: "2.2rem",
              fontFamily: GROTESK,
              fontSize: "clamp(0.72rem, 0.95vw, 0.86rem)",
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: COLORS.accent,
            }}
          >
            <span style={{ width: 28, height: 1, background: COLORS.accent }} />
            Why DG Click
          </motion.div>

          {/* manifesto headline — Fraunces, with the accent word in red */}
          <motion.h2
            {...reveal(0.08)}
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(2.3rem, 4.6vw, 4.2rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              color: COLORS.warmInk,
            }}
          >
            A moment is gone in a blink.
            <br />
            We make it{" "}
            <span
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "1.18em",
                letterSpacing: "-0.015em",
                color: COLORS.accent,
              }}
            >
              Memory
            </span>
            .
          </motion.h2>

          {/* sub — the Nepali soul */}
          <motion.p
            {...reveal(0.18)}
            style={{
              margin: "2.1rem 0 0",
              maxWidth: "44ch",
              fontFamily: GROTESK,
              fontWeight: 400,
              fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)",
              lineHeight: 1.7,
              color: "rgba(34,31,28,0.66)",
            }}
          >
            From the mandap to a baby&rsquo;s first laugh, from the red of Teej to
            the quiet in-between — we hold the moments that make a Nepali life.
          </motion.p>
        </div>

        {/* ── RIGHT — floating camera + a print-style caption beneath it ── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 48 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
          style={{
            flex: "1 1 440px",
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(22px, 3.5vh, 40px)",
          }}
        >
          {/* camera stage */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* faint Studio-Red halo behind the camera (subtle on paper) */}
            <div
              style={{
                position: "absolute",
                inset: "12% 4%",
                background:
                  "radial-gradient(closest-side, rgba(48,58,109,0.16) 0%, rgba(48,58,109,0.05) 48%, rgba(48,58,109,0) 72%)",
                filter: "blur(10px)",
                pointerEvents: "none",
              }}
            />
            {/* gentle levitation — the only moving element here */}
            <motion.img
              src={CAMERA}
              alt="Canon EOS 5D Mark IV, lens facing the studio"
              animate={reduce ? undefined : { y: [0, -14, 0] }}
              transition={
                reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 620,
                height: "auto",
                display: "block",
                userSelect: "none",
                filter: "drop-shadow(0 26px 44px rgba(0,0,0,0.20))",
              }}
            />
          </div>

          {/* caption — bottom-right, like a print label */}
          <div
            style={{
              alignSelf: "flex-end",
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              fontFamily: GROTESK,
              fontSize: "clamp(0.74rem, 0.95vw, 0.9rem)",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(34,31,28,0.5)",
              textAlign: "right",
            }}
          >
            <span style={{ width: 26, height: 1, background: COLORS.accent }} />
            A world-class service, from Kathmandu
          </div>
        </motion.div>
      </div>
    </section>
  );
}
