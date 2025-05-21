import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { Toaster } from "sonner"
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/footer";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "God's Own Model Academy (G.O.M.A)",
  description: "Nurturing minds, building character, and preparing leaders for tomorrow's challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${montserrat.variable} ${lato.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar />
          <div className="font-[family-name:var(--font-lato)]">
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              {children}
            </Suspense>
          </div>
          <Toaster position="top-right" richColors closeButton />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
