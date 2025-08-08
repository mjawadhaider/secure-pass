"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {FaHome, FaPlus, FaLock, FaDownload} from "react-icons/fa";

export default function NavBar({ onSearch }) {
    const pathname = usePathname();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);

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
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium
        ${
            pathname === path
                ? "bg-blue-400/50 text-white shadow-lg"
                : "bg-white/40 text-gray-800 hover:bg-blue-100 hover:text-blue-700"
        }`;

    return (
        <nav className="backdrop-blur bg-blend-darken border-b border-gray-200 p-2 flex gap-2 md:gap-4 fixed top-0 left-0 right-0 z-20 shadow-sm">
            <div className="flex gap-2 md:gap-4 mx-auto">
                <Link href="/" className={linkClass("/")}>
                    <FaHome /> <span className="hidden sm:inline">Home</span>
                </Link>
                <Link href="/unlock" className={linkClass("/unlock")}>
                    <FaLock /> <span className="hidden sm:inline">Unlock</span>
                </Link>
                {showInstall && (
                    <button
                        onClick={handleInstall}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600 transition"
                    >
                        <FaDownload />{" "}
                        <span className="hidden sm:inline">Download App</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
