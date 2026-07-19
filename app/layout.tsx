import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRD AI Studio",
  description: "Turn ideas into structured business requirements with AI agents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
