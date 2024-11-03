import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CLERK_APPEARANCE_CONFIG } from "@/config/clerk";
import "./globals.css";


export const metadata: Metadata = {
  title: "VI Forms",
  description: "Work In Progress Fun Project from Varadarajan M",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={CLERK_APPEARANCE_CONFIG}>
      <html lang="en">
        <body className={`bg-black antialiased dark overflow-hidden`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
