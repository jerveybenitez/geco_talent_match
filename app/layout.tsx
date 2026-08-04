import type { Metadata } from "next";
import "./globals.css";
import "./styles/fonts.css";
import "./styles/tailwind.css";
import "./styles/theme.css";

export const metadata: Metadata = {
  title: "GECO Talent Match",
  description: "HR Business Partner Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}