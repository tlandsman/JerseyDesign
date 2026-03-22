import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PhaseIndicator } from "@/components/phase-indicator";
import { SubmitterProvider } from "@/components/submitter-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Primed Jersey Voter",
  description: "Vote for your team's jersey design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SubmitterProvider>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-end">
              <PhaseIndicator />
            </div>
          </header>
          <main className="container mx-auto px-4 py-8 flex-1">
            {children}
          </main>
        </SubmitterProvider>
      </body>
    </html>
  );
}
