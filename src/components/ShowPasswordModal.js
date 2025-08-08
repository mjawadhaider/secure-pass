import {FaClipboard, FaTimes} from "react-icons/fa";
import {useState} from "react";

export default function ShowPasswordModal({viewPassword, closeViewModal}) {
    const [copied, setCopied] = useState(false);

    async function handleCopyPassword(password) {
        if (password) {
            try {
                await navigator.clipboard.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
            } catch {
                setCopied(false);
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
                <button
                    onClick={() => closeViewModal() && setCopied(false)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    aria-label="Close"
                >
                    <FaTimes className="text-xl"/>
                </button>
                <h2 className="text-xl font-bold mb-6 text-blue-700">Password Details</h2>
                <div className="mb-4">
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Title:</span> {viewPassword.title}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold text-gray-700">Username:</span> {viewPassword.username}
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                            <span className="font-semibold text-gray-700">Password:</span>
                            <span className="ml-2 font-mono tracking-wider">{viewPassword.password}</span>
                            {copied && (
                                <span className="ml-2 text-green-600 font-semibold text-xs">Copied!</span>
                            )}
                        </div>
                        <button
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                            aria-label="Copy password"
                            onClick={() => handleCopyPassword(viewPassword.password)}
                        >
                            <FaClipboard/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}