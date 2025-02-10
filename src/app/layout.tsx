import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';

import { CLERK_APPEARANCE_CONFIG } from '@/config/clerk';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query';

export const metadata: Metadata = {
  title: 'FormCraft',
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
        <body className={`bg-black antialiased dark overflow-x-hidden overflow-y-auto`}>
          <ReactQueryProvider>
            {children}
            <Toaster
              position="bottom-center"
              className="z-[99999999999999999999999] mt-3"
              duration={2000}
              toastOptions={{
                classNames: {
                  success: 'bg-[#000] border border-input text-white',
                  info: 'bg-[#000] border border-input text-white',
                },
              }}
            />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
