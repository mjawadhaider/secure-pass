import NavBar from "../../components/NavBar";
import { FaFingerprint } from "react-icons/fa";

export default function UnlockPage() {
    return (
        <>
            <NavBar />
            <div className="flex justify-center">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 w-full max-w-md mt-10 flex flex-col items-center">
                    <FaFingerprint className="text-5xl text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-6 text-blue-700">Unlock Your Vault</h2>
                    <button className="bg-green-600 hover:bg-green-700 px-8 py-3 text-white rounded-lg shadow-lg font-semibold text-lg flex items-center gap-2 transition">
                        <FaFingerprint className="text-xl" /> Unlock with Fingerprint
                    </button>
                </div>
            </div>
        </>
    );
}
