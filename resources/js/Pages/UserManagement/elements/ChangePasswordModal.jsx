import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function ChangePasswordModal({ setChangePasswordModal, selectedIds, setSelectedIds, setShowToast, setSuccessMessage }) {
    const [error, setError] = useState("");
  
    return (
    <dialog open className="modal">
        <div className="modal-box max-w-lg">
            <p className="text-lg font-bold text-center">Change Password</p>
            <Form
                className="flex flex-col gap-6 mt-6"
                method="post"
                action="/user-management/change-password"
                transform={data => ({ ...data, ids: selectedIds })}
                resetOnSuccess
                options={{ preserveScroll: true, preserveState: true }}
                onSuccess={() => {
                    setSelectedIds([]);
                    setChangePasswordModal(false);
                    setShowToast(true);
                    setSuccessMessage(`Sucessfully change the Password of ${selectedIds.length} users`);
                    setTimeout(() => setShowToast(false), 3000);
                    setError("");
                }}
                onError={(error) => setError(error)}
            >
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="newPassword" className="text-base">New Password:</label>
                        {error && (
                            <span className="text-red-500 text-sm">
                                {error.newPassword || error.ids}
                            </span>
                        )}
                    </div>
                    <input
                        type="password"
                        placeholder="Type here"
                        className="input w-full rounded-lg"
                        name="newPassword"
                        id="newPassword"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button className="btn btn-outline rounded-xl" onClick={() => setChangePasswordModal(false)}>
                        Cancel
                    </button>
                    <button className="btn bg-gray-800 text-white rounded-xl">
                        Confirm
                    </button>
                </div>
            </Form>
        </div>

        <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setChangePasswordModal(false)}
        />
    </dialog>
  )
}
