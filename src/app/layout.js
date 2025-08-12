import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SecurePass - Password Manager",
  description: "A secure, offline password manager",
  appleWebApp: {
    title: "SecurePass",
    statusBarStyle: "default",
    capable: true
  }
};

export const viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="icon" href="/icons/favicon.ico" sizes="any"/>
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png"/>
      <link rel="manifest" href="/manifest.json"/>
      <meta name="theme-color" content="#6366f1" />
    </head>
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen`}
      >
        <ThemeProvider>
          <NavBar />
          <main className="flex-grow p-4 pt-20 max-w-2xl mx-auto w-full">{children}</main>
          <footer className="bg-blend-darken border-t border-b border-gray-200 p-4 text-center text-xs text-gray-400 rounded-lg shadow-inner mt-8">
              <span className="font-semibold text-white">SecurePass</span> &copy; {new Date().getFullYear()} &mdash; Your offline vault
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
