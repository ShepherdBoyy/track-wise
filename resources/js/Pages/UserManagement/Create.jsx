import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({
    setOpenCreateModal,
    setShowToast,
    setSuccessMessage,
}) {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Add User</h3>

                <Form
                    className="flex flex-col gap-2"
                    action="/user-management/store"
                    method="post"
                    onError={(error) => setError(error)}
                    onSuccess={() => {
                        setOpenCreateModal(false);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                        setSuccessMessage(`${username} added successfully`);
                    }}
                >
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="name" className="text-sm">
                                Name:
                            </label>
                            {error.name && (
                                <span className="text-red-500 text-sm">
                                    {error.name}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="role" className="text-sm">
                                Role:
                            </label>
                            {error.role && (
                                <span className="text-red-500 text-sm">
                                    {error.role}
                                </span>
                            )}
                        </div>
                        <select
                            defaultValue=""
                            className="select w-full"
                            name="role"
                            id="role"
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option>Purchasing</option>
                            <option>Collector</option>
                            <option>Agent</option>
                            <option>Accounting</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="username" className="text-sm">
                                Username:
                            </label>
                            {error.username && (
                                <span className="text-red-500 text-sm">
                                    {error.username}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="username"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="password" className="text-sm">
                                Password:
                            </label>
                            {error.password && (
                                <span className="text-red-500 text-sm">
                                    {error.password}
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input w-full"
                            name="password"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="btn bg-gray-800 text-white"
                        >
                            Confirm
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenCreateModal(false)}
            />
        </dialog>
    );
}
