"use client";

import {FaEye, FaFingerprint, FaPlus, FaSearch, FaUserCircle} from "react-icons/fa";
import {useEffect, useState} from "react";
import AddNewPasswordModal from "../components/CreateUpdatePasswordModal";
import ShowPasswordModal from "@/components/ShowPasswordModal";
import PinModal from "@/components/PinModal";
import AuthService from "@/services/AuthService";

export default function HomePage() {
    const [passwords, setPasswords] = useState([]);
    const [filteredPasswords, setFilteredPasswords] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editPassword, setEditPassword] = useState(null);
    const [viewPassword, setViewPassword] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [selectedPasswordForAuth, setSelectedPasswordForAuth] = useState(null);
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [logs, setLogs] = useState([]);

    const addLogs = (message) => {
        setLogs(prevLogs => [...prevLogs, `${message}\n`]);
    }

    // Load passwords from localStorage on mount
    useEffect(() => {
        loadPasswords();
    }, []);

    // Update filteredPasswords when passwords change
    useEffect(() => {
        setFilteredPasswords(passwords);
    }, [passwords]);

    // Save passwords to localStorage whenever passwords change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("passwords", JSON.stringify(passwords));
            // Optional: console.log for debugging
            // console.log('Passwords saved to localStorage', passwords);
        }
    }, [passwords]);

    // Check for biometric availability on mount
    useEffect(() => {
        const checkBiometricAvailability = async () => {
            const available = await AuthService.isBiometricAvailable();
            addLogs(`isBiometricAvailable: ${available}`);
            setBiometricAvailable(available);

            // If no PIN is set, show PIN setup on first load
            if (!AuthService.hasPin()) {
                setShowPinSetup(true);
            }
        };

        checkBiometricAvailability();
    }, []);

    function loadPasswords() {
        const stored = typeof window !== "undefined" ? localStorage.getItem("passwords") : null;
        if (stored) {
            try {
                setPasswords(JSON.parse(stored));
            } catch {
                setPasswords([]);
            }
        }
    }

    function handleSearch(value) {
        setSearchTerm(value);
        if (!value.trim()) {
            setFilteredPasswords(passwords);
            return;
        }
        const filtered = passwords.filter(password =>
            password.title?.toLowerCase().includes(value.toLowerCase()) ||
            password.username?.toLowerCase().includes(value.toLowerCase()) ||
            password.url?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPasswords(filtered);
    }

    function handleKeyDown(e) {
        const value = e.target.value;
        handleSearch(value);
    }

    function addNewPassword(newPassword, isEdit = false) {
        if (isEdit && newPassword.id) {
            setPasswords(prev =>
                prev.map(p => (p.id === newPassword.id ? newPassword : p))
            );
        } else {
            setPasswords(prev => [...prev, newPassword]);
        }
        setSearchTerm("");
        setShowModal(false);
        setEditPassword(null);
    }

    function onCloseNewPasswordModal() {
        setShowModal(false);
        setEditPassword(null);
    }

    //const [handleEditPassword, setHandleEditPassword] = useState(null);

    // Add missing handleEditPassword function
    function handleEditPassword(password) {
        setEditPassword(password);
        setShowModal(true);
    }

    async function handleViewPassword(password) {
        setSelectedPasswordForAuth(password);

        // First check if we have a PIN set up
        const hasPin = AuthService.hasPin();
        addLogs(`Has PIN: ${hasPin}`);
        addLogs(`biometricAvailable: ${biometricAvailable}`);

        // If biometrics are available, try that first
        if (biometricAvailable) {
            setIsAuthenticating(true);
            try {
                const response = await AuthService.authenticateLocal();
                setLogs((prevLogs) => [...prevLogs, ...response.logs]);
                if (response.success) {
                    // Success with biometrics
                    setViewPassword(password);
                    setIsAuthenticating(false);
                    return;
                }
            } catch (error) {
                console.error("Biometric authentication failed:", error);
            }

            // Biometric failed, fall back to PIN
            setIsAuthenticating(false);
        }

        // If we have a PIN, show PIN verification
        if (hasPin) {
            setIsAuthenticating(true);
        } else {
            // No PIN set up, show PIN setup
            setShowPinSetup(true);
        }
    }

    function handlePinSuccess() {
        setIsAuthenticating(false);
        setShowPinSetup(false);
        if (selectedPasswordForAuth) {
            setViewPassword(selectedPasswordForAuth);
            setSelectedPasswordForAuth(null);
        }
    }

    function handlePinCancel() {
        setIsAuthenticating(false);
        setShowPinSetup(false);
        setSelectedPasswordForAuth(null);
    }

    function closeViewModal() {
        setViewPassword(null);
    }

    function onClickOutsideLoader(e) {
        console.log(e, 'clicked outside loader');
        e.stopPropagation();
        setIsAuthenticating(false);
    }

    // Make sure PIN setup works first time
    useEffect(() => {
        // Check if we should show PIN setup on first visit
        if (typeof window !== "undefined" && !localStorage.getItem('securepass_pin_setup_shown')) {
            setShowPinSetup(true);
            localStorage.setItem('securepass_pin_setup_shown', 'true');
        }
    }, []);

    return (
        <div>
            {/*<div*/}
            {/*    className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-50 flex flex-col justify-center rounded-2xl">*/}
            {/*    {logs.map((l, index) => (*/}
            {/*        <div key={index} className="bg-gray-800/50 p-2 rounded-lg shadow-md m-2">*/}
            {/*            <p className="text-white text-sm mb-1">*/}
            {/*                {l}*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div className="relative w-full max-w-md mx-auto mt-2 mb-5">
                <input
                    type="text"
                    placeholder="Search passwords..."
                    defaultValue={searchTerm}
                    onKeyUp={handleKeyDown}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-black bg-white/70 focus:bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            </div>

            {/* Add Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center z-30 transition"
                aria-label="Add new password"
            >
                <FaPlus className="text-2xl"/>
            </button>

            {/* Add/Edit Modal */}
            {showModal && (
                <AddNewPasswordModal
                    addNewPassword={addNewPassword}
                    onCloseModal={onCloseNewPasswordModal}
                    editPassword={editPassword}
                />
            )}

            {/* PIN Setup Modal */}
            {showPinSetup && (
                <PinModal
                    onSuccess={handlePinSuccess}
                    onCancel={handlePinCancel}
                    isSetup={true}
                />
            )}

            {/* PIN Verification Modal */}
            {isAuthenticating && !biometricAvailable && (
                <PinModal
                    onSuccess={handlePinSuccess}
                    onCancel={handlePinCancel}
                />
            )}

            {/* Biometric Authentication Indicator */}
            {isAuthenticating && biometricAvailable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClickOutsideLoader}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 text-center"
                    >
                        <FaFingerprint className="text-5xl text-blue-600 mx-auto mb-4 animate-pulse"/>
                        <h2 className="text-xl font-bold text-blue-700">
                            Verifying Identity
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Use your device&#39;s security method
                        </p>
                    </div>
                </div>
            )}

            {/* View Password Modal */}
            {viewPassword && (
                <ShowPasswordModal closeViewModal={closeViewModal} viewPassword={viewPassword}/>
            )}

            <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Saved Passwords</h2>
            <ul className="space-y-4">
                {filteredPasswords.map((item) => (
                    <li
                        key={item.id}
                        className="bg-white/80 p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-3">
                            <FaUserCircle className="text-gray-800 text-3xl"/>
                            <div>
                                <p className="font-semibold text-lg text-gray-800">{item.title}</p>
                                <p className="text-gray-500 text-sm">{item.username}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="bg-gray-800 hover:bg-gray-900 px-4 py-2 text-white rounded-lg flex items-center gap-2 shadow transition"
                                onClick={() => handleViewPassword(item)}
                            >
                                <FaEye/> <span className="hidden sm:inline">View</span>
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-lg flex items-center gap-2 shadow transition"
                                onClick={() => handleEditPassword(item)}
                                aria-label="Edit"
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
