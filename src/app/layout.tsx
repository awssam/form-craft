import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { CLERK_APPEARANCE_CONFIG } from '@/config/clerk';
import './globals.css';
import ReactQueryProvider from '@/providers/react-query';
import { getAppOriginUrl } from '@/lib/utils';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'FormCraft: No Code Visual Form Builder',
  description:
    'FormCraft is an intuitive visual form builder that empowers you to create, customize, and analyze beautiful, responsive forms without writing code. Enjoy an easy drag-and-drop interface, conditional logic, and seamless integrations.',
  keywords: [
    'FormCraft',
    'visual form builder',
    'Next.js',
    'React',
    'TypeScript',
    'DnD Kit',
    'drag and drop forms',
    'conditional logic',
    'multi-page forms',
    'form analytics',
    'integrations',
  ],
  openGraph: {
    title: 'FormCraft: No Code Visual Form Builder',
    description:
      'Build stunning, responsive forms without code using FormCraft. Enjoy a drag-and-drop builder, advanced conditional logic, and powerful integrations to automate your workflow.',
    url: getAppOriginUrl(),
    siteName: 'FormCraft',
    images: [
      {
        url: `${getAppOriginUrl()}/images/og.png`,
        width: 1200,
        height: 630,
        alt: 'FormCraft Landing Page',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormCraft: No Code Visual Form Builder',
    description:
      'Create stunning forms effortlessly with FormCraft’s drag-and-drop interface, intelligent logic, and seamless integrations.',
    images: [`${getAppOriginUrl()}/images/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={CLERK_APPEARANCE_CONFIG}>
      <html lang="en">
        <head>
          <link id='font-link' rel='stylesheet' />
        </head>
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
            <Analytics />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
