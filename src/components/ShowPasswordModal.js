import {FaClipboard, FaTimes, FaCheck, FaKey, FaUser, FaLock} from "react-icons/fa";
import {useState} from "react";

export default function ShowPasswordModal({viewPassword, closeViewModal}) {
    const [copied, setCopied] = useState(false);

    async function handleCopyPassword(password) {
        if (password) {
            try {
                await navigator.clipboard.writeText(password);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                setCopied(false);
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative animate-scaleIn">
                <button
                    onClick={() => closeViewModal() && setCopied(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <FaTimes/>
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                        <FaKey className="text-xl"/>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        {viewPassword.title}
                    </h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="text-indigo-500">
                            <FaUser/>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-0.5">Username</div>
                            <div className="text-gray-800 font-medium">{viewPassword.username}</div>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="text-indigo-500">
                                    <FaLock/>
                                </div>
                                <div className="text-sm text-gray-500">Password</div>
                            </div>
                            <button
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    copied 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                                }`}
                                onClick={() => handleCopyPassword(viewPassword.password)}
                                aria-label="Copy password"
                            >
                                {copied ? <FaCheck/> : <FaClipboard/>}
                            </button>
                        </div>

                        <div className="mt-1 font-mono tracking-wider text-gray-800 bg-white p-3 rounded-lg border border-gray-200 break-all">
                            {viewPassword.password}
                        </div>

                        {copied && (
                            <div className="mt-2 text-green-600 text-sm font-medium flex items-center gap-1.5 animate-fadeIn">
                                <FaCheck size={12}/> Copied to clipboard
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => closeViewModal() && setCopied(false)}
                        className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl
                        transition-colors duration-200 mt-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}