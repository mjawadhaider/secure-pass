import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
    title: "SecurePass",
    description: "Secure offline password manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <head>
         <link rel="manifest" href="/manifest.json" />
     </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen`}
      >
        <NavBar />
        <main className="flex-grow p-4 pt-20 max-w-2xl mx-auto w-full">{children}</main>
        <footer className="bg-blend-darken border-t border-b border-gray-200 p-4 text-center text-xs text-gray-400 rounded-lg shadow-inner mt-8">
            <span className="font-semibold text-white">SecurePass</span> &copy; {new Date().getFullYear()} &mdash; Your offline vault
        </footer>
      </body>
    </html>
  );
}
