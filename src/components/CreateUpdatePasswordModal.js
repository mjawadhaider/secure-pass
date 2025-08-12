import {FaPlus, FaTimes, FaSave, FaKey} from "react-icons/fa";
import {useState, useEffect} from "react";

export default function AddPasswordPage({addNewPassword, onCloseModal, editPassword}) {
    const [payload, setPayload] = useState({
        title: "",
        username: "",
        password: "",
        url: "",
    });
    const [msgConfig, setMsgConfig] = useState({
        msg: '',
        show: false,
        type: 'error',
    });

    useEffect(() => {
        if (editPassword) {
            setPayload({
                title: editPassword.title || "",
                username: editPassword.username || "",
                password: editPassword.password || "",
                url: editPassword.url || "",
                id: editPassword.id,
            });
        } else {
            setPayload({
                title: "",
                username: "",
                password: "",
                url: "",
            });
        }
    }, [editPassword]);

    const closeModal = () => onCloseModal();

    const showError = (message) => {
        setMsgConfig({
            msg: message,
            show: true,
            type: 'error',
        })
    }

    const handleAddPassword = (e) => {
        e.preventDefault();
        if (!payload || !payload.title.trim() || !payload.username.trim() || !payload.password.trim()) {
            return showError('Please fill in all fields');
        }
        addNewPassword(
            {
                id: payload.id || Date.now(),
                url: payload.url || "",
                title: payload.title,
                username: payload.username,
                password: payload.password,
            },
            !!editPassword
        );
        closeModal();
    };

    const updatePayload = (e) => {
        setPayload((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 relative animate-scaleIn">
                <button
                    onClick={closeModal}
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
                        {editPassword ? "Edit Password" : "Add New Password"}
                    </h2>
                </div>

                <form className="space-y-4" onSubmit={handleAddPassword}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Gmail, Twitter, Bank"
                            name="title"
                            value={payload.title}
                            onChange={updatePayload}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="your.email@example.com"
                            name="username"
                            value={payload.username}
                            onChange={updatePayload}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={payload.password}
                            onChange={updatePayload}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl
                        flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        {editPassword ? <FaSave/> : <FaPlus/>}
                        {editPassword ? "Update Password" : "Add Password"}
                    </button>

                    {msgConfig.show && (
                        <div
                            className={`p-3 rounded-xl ${msgConfig.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' : 
                            'bg-green-100 text-green-800 border border-green-200'} animate-fadeIn`}>
                            {msgConfig.msg}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
