import type { Metadata } from "next";
import { Fraunces, Inter, Space_Grotesk, Archivo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import BookingModal from "@/components/BookingModal";

// Phase 2.1 (roadmap T2) — display serif with a voice. Fraunces variable:
// full weight range + the optical-size axis, so it stays inky and structural
// at 11rem display sizes instead of going wispy (Cormorant's disease).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// DG Click — modern grotesque for eyebrows / labels / UI. Characterful where
// Inter was neutral; pairs with Fraunces for the "creative studio" voice.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

// DG Click — heavy display grotesque for the main heading (footer "SHOOT" heft).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
export const metadata: Metadata = {
  title: "DG Click — Photography Studio, Nepal",
  description: "Capture your moment. A photography studio in Kathmandu, Nepal.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${spaceGrotesk.variable} ${archivo.variable}`}
    >
      <body>
        {/* Always open at the hero. Runs synchronously during HTML parse —
            before the browser's native scroll-restoration fires on load — so a
            refresh can never land mid-page. SmoothScroll re-pins on pageshow. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);",
          }}
        />
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <BookingModal />
      </body>
    </html>
  );
}
