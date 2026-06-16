// Footer — DG Click closes on the "SHOOT" wordmark banner (footer.jpeg), with a
// minimal copyright strip.

import { GROTESK, COLORS } from "@/lib/theme";

const FOOTER_IMG = "/images/footer.jpeg";

export default function Footer() {
  return (
    <footer id="contact" style={{ background: COLORS.ink, scrollMarginTop: "90px" }}>
      {/* closing banner */}
      <img
        src={FOOTER_IMG}
        alt="DG Click — Shoot"
        style={{ display: "block", width: "100%", height: "auto" }}
      />

      {/* minimal copyright strip */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "clamp(20px, 3vh, 30px) clamp(24px, 4.7vw, 90px)",
          fontFamily: GROTESK,
          fontSize: "0.78rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "rgba(242,239,233,0.45)",
        }}
      >
        <span>© 2026 DG Click — Photography Studio · Kathmandu, Nepal</span>
        <span style={{ color: COLORS.accent }}>Capture your moment</span>
      </div>
    </footer>
  );
}
