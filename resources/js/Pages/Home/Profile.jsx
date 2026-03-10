import { Form, usePage } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import Master from "../components/Master";
import { useState } from "react";

import { motion, AnimatePresence } from "motion/react";

export default function Profile({}) {
    const { user, userInitials, userAreas } = usePage().props.auth;

    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    return (
        <Master>
            <div className="space-y-6 mx-auto max-w-6xl py-6">
                {showToast && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-info">
                            <span>Profile Updated Successfully</span>
                        </div>
                    </div>
                )}
                <div className="">
                    <span className="text-2xl">Profile Settings</span>
                </div>

                {/* Card 1 */}
                <div>
                    <div className="card bg-base-100">
                        <div className="card-body space-y-8 p-8">
                            <span className="text-lg">My Profile</span>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="avatar avatar-placeholder">
                                        <div className="bg-neutral text-neutral-content w-14 rounded-full">
                                            <span className={`${userInitials.length > 2 ? "text-md" : "text-lg"}`}>
                                                {userInitials}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-lg">
                                            {user.name}
                                        </span>
                                        <p className="text-gray-400">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="btn font-medium flex items-center gap-2 border rounded-full"
                                    >
                                        Edit Profile
                                        <Pencil size={18} strokeWidth="1.7" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <Form
                    className="space-y-6"
                    action={`/profile/edit/${user.id}`}
                    method="put"
                    onError={(error) => setError(error)}
                    resetOnSuccess={["password", "password_confirmation"]}
                    onSuccess={() => {
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                        setEditing(false);
                        setError("");
                    }}
                >
                    <div>
                        <div className="card bg-base-100 ">
                            <div className="card-body space-y-8 p-8">
                                <span className="text-lg">
                                    Account Information
                                </span>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-md text-gray-400">
                                                Name:
                                            </label>
                                            {error.name && (
                                                <span className="text-red-500 text-sm">
                                                    {error.name}
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            className={`input input-md ${!editing ? "p-0 bg-transparent border-none text-black cursor-default" : ""}`}
                                            defaultValue={user.name}
                                            name="name"
                                            disabled={!editing}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-md text-gray-400">
                                                Username:
                                            </label>
                                            {error.username && (
                                                <span className="text-red-500 text-sm">
                                                    {error.username}
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            className={`input input-md ${!editing ? "p-0 bg-transparent text-black border-none cursor-default" : ""}`}
                                            defaultValue={user.username}
                                            name="username"
                                            disabled={!editing}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-md text-gray-400">
                                            Areas Covered:
                                        </label>

                                        <div className="space-x-2">
                                            {userAreas.map((area, index) => (
                                                <span
                                                    className="badge badge-neutral badge-md font-normal rounded-full"
                                                    key={index}
                                                >
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div>
                        <div className="card bg-base-100">
                            <div className="card-body space-y-8 p-8">
                                <span className="text-lg">
                                    Password Settings
                                </span>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-md text-gray-400">
                                                New password:
                                            </label>
                                            {error.password && (
                                                <span className="text-red-500 text-sm">
                                                    {error.password}
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            type="password"
                                            className="input input-md"
                                            name="password"
                                            readOnly={!editing}
                                            placeholder={`${editing ? "Type here" : ""}`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-md text-gray-400">
                                                Confirm new password:
                                            </label>
                                            {error.password_confirmation && (
                                                <span className="text-red-500 text-sm">
                                                    {error.password_confirmation}
                                                </span>
                                            )}
                                        </div>

                                        <input
                                            type="password"
                                            className="input input-md"
                                            name="password_confirmation"
                                            readOnly={!editing}
                                            placeholder={`${editing ? "Type here" : ""}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AnimatePresence>
                            {editing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="flex justify-end gap-3 mt-8"
                                >
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-lg font-normal"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-ghost font-normal"
                                        onClick={() => setEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Form>
            </div>
        </Master>
    );
}
