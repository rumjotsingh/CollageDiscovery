import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { AuthModalProvider } from "@/providers/AuthModalProvider";
import { LoginModal } from "@/components/auth/LoginModal";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollegeIQ — College Discovery Platform",
  description: "Discover, compare, and save Indian colleges",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>
            <AuthModalProvider>
              <TooltipProvider>
                {children}
                <LoginModal />
              </TooltipProvider>
            </AuthModalProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
