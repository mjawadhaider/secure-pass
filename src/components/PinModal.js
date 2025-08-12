import { useState, useEffect } from "react";
import { FaTimes, FaLock, FaShieldAlt, FaCheck, FaExclamationCircle } from "react-icons/fa";
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

  // Focus the input when modal opens
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const input = document.querySelector('input[inputmode="numeric"]');
      if (input) {
        input.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showConfirm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 relative animate-scaleIn">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <FaTimes/>
        </button>

        <div className="text-center my-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            {isSetup ? <FaShieldAlt className="text-2xl"/> : <FaLock className="text-2xl"/>}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {isSetup
                ? showConfirm
                  ? "Confirm your PIN"
                  : "Create a PIN"
                : "Enter your PIN"}
          </h2>

          <p className="text-gray-500 text-sm">
            {isSetup
                ? "Secure your passwords with a PIN code"
                : "Enter your PIN to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <input
              type="password"
              placeholder={showConfirm ? "Confirm PIN" : "Enter PIN"}
              value={showConfirm ? confirmPin : pin}
              onChange={showConfirm ? handleConfirmPinChange : handlePinChange}
              className="text-center text-2xl tracking-widest w-full px-4 py-3.5 rounded-xl border border-gray-200
              focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-gray-50"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-fadeIn">
              <FaExclamationCircle className="flex-shrink-0"/>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl
            flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSetup
                ? showConfirm
                  ? <><FaCheck className="mr-1"/> Confirm PIN</>
                  : "Continue"
                : <><FaLock className="mr-1"/> Unlock</>}
          </button>

          {!isSetup && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl
              transition-colors duration-200 mt-2"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
