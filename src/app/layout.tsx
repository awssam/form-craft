import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

import { CLERK_APPEARANCE_CONFIG } from '@/config/clerk';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query';

export const metadata: Metadata = {
  title: 'VI Forms',
  description: 'Work In Progress Fun Project from Varadarajan M',
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
          <ReactQueryProvider>
            {children}
            <Toaster position="bottom-center" className="z-[99999999999999999999999]" duration={2000} richColors />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
