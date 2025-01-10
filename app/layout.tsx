import HeaderAuth from "@/components/header-auth";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "CSICX 2024",
  description: "CSICX 2024",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar>
            <HeaderAuth />
          </Navbar>

          <div className="mt-16 bg-slate-100 min-h-screen">
            {children}
          </div>
        
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
