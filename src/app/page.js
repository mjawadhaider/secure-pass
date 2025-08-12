"use client";

import {FaEye, FaFingerprint, FaPlus, FaSearch, FaUserCircle, FaPencilAlt, FaTrash, FaKey, FaLock} from "react-icons/fa";
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
    const [passwordToDelete, setPasswordToDelete] = useState(null);
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [showPinSetup, setShowPinSetup] = useState(false);
    const [logs, setLogs] = useState([]);
    const [authAction, setAuthAction] = useState(null);

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

    async function validateDeviceAuthentication(callbackFunc, ...args) {
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
                    if (!callbackFunc) {
                        throw new Error("Callback function is required for biometric authentication");
                    }
                    callbackFunc(...args);
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

    async function handleEditPassword(password) {
        setEditPassword(password);
        setAuthAction('edit'); // Set what action we're authenticating for
        await validateDeviceAuthentication(setShowModal, true);
    }

    async function handleViewPassword(password) {
        setSelectedPasswordForAuth(password);
        setAuthAction('view'); // Set action to view
        await validateDeviceAuthentication(setViewPassword, password);
    }

    async function handleDeletePassword(password) {
        setPasswordToDelete(password);
        setAuthAction('delete'); // Set action to delete
        await validateDeviceAuthentication(confirmDelete, password);
    }

    function confirmDelete(password) {
        const updatedPasswords = passwords.filter(p => p.id !== password.id);
        setPasswords(updatedPasswords);
        setPasswordToDelete(null);
    }

    function handlePinSuccess() {
        setIsAuthenticating(false);
        setShowPinSetup(false);

        // Handle different actions based on authAction
        if (authAction === 'view' && selectedPasswordForAuth) {
            setViewPassword(selectedPasswordForAuth);
            setSelectedPasswordForAuth(null);
        } else if (authAction === 'edit' && editPassword) {
            setShowModal(true); // Open the edit modal
        } else if (authAction === 'delete' && passwordToDelete) {
            confirmDelete(passwordToDelete);
        }

        setAuthAction(null); // Reset action
    }

    function handlePinCancel() {
        setIsAuthenticating(false);
        setShowPinSetup(false);
        setSelectedPasswordForAuth(null);
        setAuthAction(null); // Reset action

        // Clear edit state on cancel
        if (authAction === 'edit') {
            setEditPassword(null);
        }

        // Clear delete state on cancel
        if (authAction === 'delete') {
            setPasswordToDelete(null);
        }
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
        <div className="min-h-screen pb-20 px-4 max-w-2xl mx-auto pt-20">
            {/* Search Bar */}
            <div className="relative w-full mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search passwords..."
                    defaultValue={searchTerm}
                    onKeyUp={handleKeyDown}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-800 glass focus:outline-none
                    focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"/>
            </div>

            {/* Add Button */}
            <button
                onClick={() => setShowModal(true)}
                className="fixed bottom-6 right-6 bg-white p-3.5 rounded-full shadow-lg hover:shadow-xl
                text-indigo-600 z-30 transition-all duration-300 transform hover:scale-110 border border-indigo-100"
                aria-label="Add new password"
            >
                <FaPlus className="text-xl"/>
            </button>

            {/* Section Title */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-indigo-500 p-2 rounded-lg text-white shadow-md">
                    <FaKey className="text-xl"/>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                    Your Passwords
                </h2>
            </div>

            {/* Password List */}
            {filteredPasswords.length === 0 ? (
                <div className="glass p-8 rounded-xl text-center animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                        <FaLock className="text-2xl"/>
                    </div>
                    <p className="text-gray-600 mb-2">No passwords found</p>
                    <p className="text-gray-500 text-sm">Add your first password using the + button</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {filteredPasswords.map((item) => (
                        <li
                            key={item.id}
                            className="glass p-4 rounded-xl flex items-center justify-between hover:shadow-md
                            transition-all duration-300 border-l-4 border-indigo-500 animate-slideUp"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                                    <FaUserCircle className="text-xl"/>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{item.title}</p>
                                    <p className="text-gray-500 text-sm">{item.username}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewPassword(item)}
                                    className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg
                                    transition-colors duration-200"
                                    aria-label="View"
                                >
                                    <FaEye/>
                                </button>
                                <button
                                    onClick={() => handleEditPassword(item)}
                                    className="p-2 text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg
                                    transition-colors duration-200"
                                    aria-label="Edit"
                                >
                                    <FaPencilAlt/>
                                </button>
                                <button
                                    onClick={() => handleDeletePassword(item)}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg
                                    transition-colors duration-200"
                                    aria-label="Delete"
                                >
                                    <FaTrash/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Biometric Authentication Indicator */}
            {isAuthenticating && biometricAvailable && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fadeIn"
                     onClick={onClickOutsideLoader}>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform animate-scaleIn max-w-xs w-full mx-4">
                        <FaFingerprint className="text-6xl text-indigo-500 mx-auto mb-6 animate-pulse"/>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Verifying Identity
                        </h2>
                        <p className="text-gray-500">
                            Use your device&#39;s security method
                        </p>
                    </div>
                </div>
            )}

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

            {/* View Password Modal */}
            {viewPassword && (
                <ShowPasswordModal closeViewModal={closeViewModal} viewPassword={viewPassword}/>
            )}
        </div>
    );
}
