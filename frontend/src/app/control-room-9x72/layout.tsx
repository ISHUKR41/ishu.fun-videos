import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Control Room",
  description: "Hidden administrative control room",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": 0
    }
  }
};

export default function ControlRoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
