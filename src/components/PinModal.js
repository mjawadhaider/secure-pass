import { useState, useEffect } from "react";
import { FaTimes, FaLock } from "react-icons/fa";
import AuthService from "../services/AuthService";

export default function PinModal({ onSuccess, onCancel, isSetup = false }) {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePinChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError("");
    }
  };

  const handleConfirmPinChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setConfirmPin(value);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSetup) {
      if (!showConfirm) {
        if (pin.length < 4) {
          setError("PIN must be at least 4 digits");
          return;
        }
        setShowConfirm(true);
        return;
      } else {
        if (pin !== confirmPin) {
          setError("PINs don't match");
          return;
        }

        AuthService.savePin(pin);
        onSuccess();
      }
    } else {
      // Verification mode
      if (AuthService.verifyPin(pin)) {
        onSuccess();
      } else {
        setError("Incorrect PIN");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="text-center mb-6">
          <FaLock className="text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-blue-700">
            {isSetup
              ? (showConfirm ? "Confirm your PIN" : "Set up a PIN")
              : "Enter your PIN"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isSetup
              ? "Create a PIN to protect your passwords"
              : "Enter your PIN to view this password"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder={showConfirm ? "Confirm PIN" : "Enter PIN"}
            value={showConfirm ? confirmPin : pin}
            onChange={showConfirm ? handleConfirmPinChange : handlePinChange}
            className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 p-3 w-full rounded-lg transition text-center text-2xl tracking-widest"
            autoFocus
            inputMode="numeric"
          />

          {error && (
            <div className="text-red-500 text-center font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white rounded-lg flex items-center gap-2 font-semibold shadow transition w-full justify-center"
          >
            {isSetup
              ? (showConfirm ? "Confirm PIN" : "Continue")
              : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

