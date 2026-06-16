"use client";

// DG Click — div 3, "What We Capture". A constellation of the six shoot types
// orbiting a centered promise (Mobbin-style scatter). Each tile sits tilted in
// its own position, floats gently, and straightens + shows a red ring + its
// label on hover. Outer tiles sit softer/dimmer for depth. Continuous paper
// flow from div 2. transform/opacity only; reduced-motion = static & readable.

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SERIF, GROTESK, COLORS } from "@/lib/theme";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DIR = "/photo_shoot";

type Cfg = {
  img: string;
  label: string;
  top: string;
  left: string;
  vw: number;
  max: number;
  rot: number;
  amp: number;
  dur: number;
  phase: number;
  depth: number; // 1 = front/sharp, lower = back/soft
};

// Uniform tile size for all six (source images share the same square ratio).
const TILE_VW = 15;
const TILE_MAX = 210;

const TILES: Cfg[] = [
  { img: "weeding_shoot",  label: "Weddings",             top: "8%",  left: "10%", vw: TILE_VW, max: TILE_MAX, rot: -6, amp: 12, dur: 6.5, phase: 0,   depth: 1.0 },
  { img: "festival_shoot", label: "Teej & Festivals",     top: "12%", left: "69%", vw: TILE_VW, max: TILE_MAX, rot: 6,  amp: 14, dur: 7.2, phase: 0.6, depth: 0.95 },
  { img: "bab_shower",     label: "Baby Showers",          top: "47%", left: "2%",  vw: TILE_VW, max: TILE_MAX, rot: 5,  amp: 10, dur: 6.0, phase: 1.1, depth: 0.8 },
  { img: "professional",   label: "Corporate & Portraits", top: "53%", left: "81%", vw: TILE_VW, max: TILE_MAX, rot: -5, amp: 11, dur: 6.8, phase: 0.3, depth: 0.84 },
  { img: "pasni",          label: "Pasni & Newborn",       top: "70%", left: "21%", vw: TILE_VW, max: TILE_MAX, rot: 7,  amp: 13, dur: 7.0, phase: 0.9, depth: 0.92 },
  { img: "school_shoot",   label: "School & +2 Batch",     top: "66%", left: "62%", vw: TILE_VW, max: TILE_MAX, rot: -4, amp: 12, dur: 6.3, phase: 0.4, depth: 1.0 },
];

function Tile({ cfg, index, reduce }: { cfg: Cfg; index: number; reduce: boolean | null }) {
  const [hover, setHover] = useState(false);
  const baseOpacity = 1; // all tiles fully clear (depth now via size only)

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      whileInView={reduce ? undefined : { opacity: baseOpacity, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.09 }}
      style={{
        position: "absolute",
        top: cfg.top,
        left: cfg.left,
        width: `clamp(96px, ${cfg.vw}vw, ${cfg.max}px)`,
        zIndex: hover ? 30 : Math.round(cfg.depth * 10),
        opacity: reduce ? baseOpacity : undefined,
      }}
    >
      {/* interaction + tilt (static — no perpetual float, so tiles stay crisp
          while tilted; a constant transform animation forces a soft GPU layer) */}
      <motion.div
        animate={{ rotate: hover ? 0 : cfg.rot, y: hover ? -10 : 0 }}
        transition={{
          rotate: { duration: 0.4, ease: EASE_OUT },
          y: { duration: 0.4, ease: EASE_OUT },
        }}
        style={{
          position: "relative",
          cursor: "pointer",
          // Rasterize the tilted tile at device resolution (not the layout-px
          // offscreen buffer a filter would force) so the 2K photo stays crisp.
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <img
          src={`${DIR}/${cfg.img}.jpeg`}
          alt={cfg.label}
          draggable={false}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: 20,
            // box-shadow (not filter:drop-shadow) — the photo is never flattened
            // into a low-res filter buffer, so it renders sharp from the source.
            boxShadow: "0 22px 40px rgba(0,0,0,0.18)",
            userSelect: "none",
          }}
        />
        {/* red ring on hover */}
        <div
          style={{
            position: "absolute",
            inset: -3,
            borderRadius: 23,
            border: `2px solid ${COLORS.accent}`,
            opacity: hover ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        />
        {/* label chip on hover */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -14,
            transform: `translateX(-50%) translateY(${hover ? 0 : 6}px)`,
            opacity: hover ? 1 : 0,
            transition: "opacity 0.3s ease, transform 0.3s ease",
            whiteSpace: "nowrap",
            background: COLORS.warmInk,
            color: COLORS.paper,
            padding: "0.42rem 0.85rem",
            borderRadius: 999,
            fontFamily: GROTESK,
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {cfg.label}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServicesConstellation() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      style={{
        position: "relative",
        minHeight: "clamp(780px, 104vh, 1040px)",
        background: COLORS.paper,
        color: COLORS.warmInk,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollMarginTop: "80px",
      }}
    >
      {/* orbiting tiles */}
      {TILES.map((cfg, i) => (
        <Tile key={cfg.img} cfg={cfg} index={i} reduce={reduce} />
      ))}

      {/* centered promise */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        style={{
          position: "relative",
          zIndex: 20,
          textAlign: "center",
          padding: "0 clamp(20px, 4vw, 40px)",
          maxWidth: 620,
          pointerEvents: "none",
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.7rem",
            marginBottom: "1.4rem",
            fontFamily: GROTESK,
            fontSize: "clamp(0.72rem, 0.95vw, 0.86rem)",
            fontWeight: 600,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: COLORS.accent,
          }}
        >
          <span style={{ width: 26, height: 1, background: COLORS.accent }} />
          What We Capture
          <span style={{ width: 26, height: 1, background: COLORS.accent }} />
        </div>

        {/* headline */}
        <h2
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: "clamp(2.4rem, 5vw, 4.6rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.02em",
            color: COLORS.warmInk,
          }}
        >
          Every moment,
          <br />
          in{" "}
          <span style={{ fontStyle: "italic", color: COLORS.accent }}>focus</span>.
        </h2>

        {/* service list / sub */}
        <p
          style={{
            margin: "1.5rem auto 0",
            maxWidth: "40ch",
            fontFamily: GROTESK,
            fontWeight: 400,
            fontSize: "clamp(0.95rem, 1.3vw, 1.12rem)",
            lineHeight: 1.6,
            letterSpacing: "0.02em",
            color: "rgba(34,31,28,0.6)",
          }}
        >
          Weddings · Pasni · Baby showers · Teej &amp; festivals · Corporate ·
          School batches
        </p>
      </motion.div>
    </section>
  );
}
