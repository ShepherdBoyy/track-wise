import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ViewModal({ selectedUser, setOpenViewModal }) {
    const [copiedField, setCopiedField] = useState(null);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => {
            setCopiedField(null);
        }, 2000);
    };

    const getAccessLevel = () => {
        const canViewAllHospitals = selectedUser.permissions.some(
            (permission) => permission.name === "view_all_hospitals",
        );

        if (canViewAllHospitals) {
            return "All Hospitals";
        } else if (selectedUser.areas) {
            return selectedUser.areas.map((area) => area.area_name).join(", ");
        } else {
            return "No Access";
        }
    };

    const accessLevel = getAccessLevel();

    return (
        <dialog open className="modal">
            <div className="modal-box max-w-xl bg-white rounded-2xl shadow-2xl p-0">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="font-semibold text-xl text-gray-900">
                        Details
                    </h3>
                    <button
                        onClick={() => setOpenViewModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 mb-1">Full Name</p>
                        <div className="flex items-center justify-between">
                            <p className="text-blue-600 font-medium text-lg">
                                {selectedUser.name}
                            </p>
                            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-3 py-1 rounded-full">
                                {accessLevel}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">
                                Username
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-900 font-medium break-all">
                                    {selectedUser.username}
                                </p>
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            selectedUser.username,
                                            "username",
                                        )
                                    }
                                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0 cursor-pointer tooltip"
                                    data-tip="copy"
                                >
                                    {copiedField === "username" ? (
                                        <Check
                                            size={16}
                                            className="text-green-500 animate-scale-in"
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-2">
                                Password
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-900 font-medium">
                                    {selectedUser.plain_password}
                                </p>
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            selectedUser.plain_password,
                                            "password",
                                        )
                                    }
                                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2 flex-shrink-0 cursor-pointer tooltip"
                                    data-tip="copy"
                                >
                                    {copiedField === "password" ? (
                                        <Check
                                            size={16}
                                            className="text-green-500 animate-scale-in"
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="modal-backdrop"
                onClick={() => setOpenViewModal(false)}
            >
                <button>close</button>
            </div>
        </dialog>
    );
}
