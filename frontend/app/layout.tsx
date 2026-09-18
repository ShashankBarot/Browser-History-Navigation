import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Browser History Navigator",
  description: "Interactive browser history and doubly linked list visualizer",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}