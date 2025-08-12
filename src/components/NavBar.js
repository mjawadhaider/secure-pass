"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHome, FaLock, FaDownload, FaKey, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

export default function NavBar({ onSearch }) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Hide install button if already running as standalone
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true);

    if (isStandalone) {
      setShowInstall(false);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // If the event never fires, hide the button
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstall(false);
      }
      setDeferredPrompt(null);
    }
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium ${
      pathname === path
        ? "bg-indigo-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-screen-lg mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
            <FaKey className="text-xl" />
            <span>SecurePass</span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className={linkClass("/")}>
              <FaHome className="text-lg" />{" "}
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/unlock" className={linkClass("/unlock")}>
              <FaLock className="text-lg" />{" "}
              <span className="hidden sm:inline">Unlock</span>
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <FaSun className="text-amber-300" />
              ) : (
                <FaMoon />
              )}
            </button>

            {showInstall && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white
                font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:bg-green-700"
              >
                <FaDownload />{" "}
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
