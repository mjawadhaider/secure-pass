import {FaPlus, FaTimes} from "react-icons/fa";
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
        <>
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl"/>
                    </button>
                    <h2 className="text-xl font-bold mb-6 text-blue-700">
                        {editPassword ? "Edit Password" : "Add New Password"}
                    </h2>
                    <form className="space-y-4" onSubmit={handleAddPassword}>
                        <input
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={payload.title}
                            onChange={updatePayload}
                            className="text-input"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={payload.username}
                            onChange={updatePayload}
                            className="text-input"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={payload.password}
                            onChange={updatePayload}
                            className="text-input"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white rounded-lg flex items-center gap-2 font-semibold shadow transition w-full justify-center"
                        >
                            <FaPlus/> {editPassword ? "Update Password" : "Add Password"}
                        </button>
                        {msgConfig.show && (
                            <div
                                className={`mt-4 p-3 rounded-lg text-white ${msgConfig.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                                {msgConfig.msg}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
