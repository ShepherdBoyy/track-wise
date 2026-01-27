import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Profile({ setOpenProfile, user, setShowToast }) {
    const [error, setError] = useState("");

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">
                    Profile Details
                </h3>
                <Form
                    action={`/profile-details/${user.id}`}
                    method="put"
                    onError={(error) => setError(error)}
                    onSuccess={() => {
                        setOpenProfile(false);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
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
                            defaultValue={user.name}
                        />
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
                            defaultValue={user.username}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="password" className="text-sm">
                                Change Password:
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

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label
                                htmlFor="password_confirmation"
                                className="text-sm"
                            >
                                Confirm Password:
                            </label>
                            {error.password_confirmation && (
                                <span className="text-red-500 text-sm">
                                    {error.password_confirmation}
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input w-full"
                            name="password_confirmation"
                        />
                    </div>

                    <div className="flex justify-end mt-6 gap-2">
                        <button
                            className="btn btn-outline rounded-xl"
                            onClick={() => {
                                setOpenProfile(false);
                            }}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="btn bg-gray-800 text-white rounded-xl "
                        >
                            Update
                        </button>
                    </div>
                </Form>
            </div>
            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenProfile(false)}
            >
                <button>close</button>
            </form>
        </dialog>
    );
}
