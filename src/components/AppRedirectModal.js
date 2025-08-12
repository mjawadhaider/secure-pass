import { useState } from 'react';
import { FaExternalLinkAlt, FaTimes, FaMobile } from 'react-icons/fa';

export default function AppRedirectModal({ onClose }) {
  const openInstalledApp = () => {
    // Get the manifest URL from the link tag
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      // Create a URL that will redirect to the app using the custom scheme
      // This works with most modern PWA implementations
      window.location.href = window.location.href.split('#')[0];
    }
    onClose();
  };

  const continueInBrowser = () => {
    // Save preference to not show this again for this session
    sessionStorage.setItem('skipAppRedirect', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="text-center my-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <FaMobile className="text-2xl" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            SecurePass App Installed
          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            You have the app installed on this device. Would you like to open it?
          </p>

          <div className="space-y-3">
            <button
              onClick={openInstalledApp}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl
              flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaMobile /> Open App
            </button>

            <button
              onClick={continueInBrowser}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
              text-gray-800 dark:text-gray-200 rounded-xl transition-colors duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <FaExternalLinkAlt className="text-sm" /> Continue in Browser
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

