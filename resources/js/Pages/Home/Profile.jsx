import { usePage } from "@inertiajs/react";
import { Pencil } from "lucide-react";
import Master from "../components/Master";
import { useState } from "react";

import { motion, AnimatePresence } from "motion/react";

export default function Profile({}) {
    const { user, userInitials, userAreas } = usePage().props.auth;

    const [editing, setEditing] = useState(false);
    console.log(usePage().props.auth);

    return (
        <Master>
            <div className="space-y-6 mx-auto max-w-6xl py-10">
                <div className="">
                    <span className="text-2xl">Profile Settings</span>
                </div>

                <div>
                    <div className="card bg-base-100">
                        <div className="card-body space-y-8 p-8">
                            <span className="text-lg">My Profile</span>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="avatar avatar-placeholder">
                                        <div className="bg-neutral text-neutral-content w-14 rounded-full">
                                            <span className="text-lg">
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
                                        className="btn font-medium flex items-center gap-2 border rounded-full  "
                                    >
                                        Edit Profile
                                        <Pencil size={18} strokeWidth="1.7" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card bg-base-100 ">
                        <div className="card-body space-y-8 p-8">
                            <span className="text-lg">Account Information</span>
                            <form>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-md text-gray-400">
                                            Name:
                                        </label>

                                        {editing ? (
                                            <input
                                                className="input input-md"
                                                defaultValue={user.name}
                                                name="name"
                                            />
                                        ) : (
                                            <p className="text-lg">
                                                {user.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-md text-gray-400">
                                            Username:
                                        </label>

                                        {editing ? (
                                            <input
                                                className="input input-md"
                                                defaultValue={user.username}
                                                name="name"
                                            />
                                        ) : (
                                            <p className="text-lg">
                                                {user.username}
                                            </p>
                                        )}
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
                                    <div className="flex flex-col gap-2">
                                        <label className="text-md text-gray-400">
                                            Password:
                                        </label>

                                        <p className="text-lg"></p>
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
                                            className="flex justify-end gap-3 mt-6"
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
                                                onClick={() =>
                                                    setEditing(false)
                                                }
                                            >
                                                Cancel
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
