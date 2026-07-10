import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function UpdateInvoiceModal({ 
    setOpenUpdateModal,
    setShowToast,
    setSuccessMessage,
    setIsSelectMode,
    editor,
    hospital,
    selectedIds,
    setSelectedIds
}) {
    const [error, setError] = useState("");

  return (
    <dialog open className="modal">
        <div className="modal-box max-w-2xl">
            <p className="text-lg font-bold text-center">Update Invoice</p>
            <Form
                className="flex flex-col gap-6"
                action={`/hospitals/${hospital.id}/invoices/update-history`}
                transform={data => ({ ...data, ids: selectedIds })}
                method="post"
                resetOnSuccess
                options={{ preserveScroll: true, preserveState: true }}
                onSuccess={() => {
                    setSelectedIds([]);
                    setOpenUpdateModal(false);
                    setIsSelectMode(false);
                    setShowToast(true);
                    setSuccessMessage(`Sucessfully updated ${selectedIds.length} invoices`);
                    setTimeout(() => setShowToast(false), 3000);
                    setError("");
                }}
                onError={(error) => setError(error)}
            >
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="updated_by" className="text-base">Update By:</label>
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input w-full rounded-lg"
                        name="updated_by"
                        id="updated_by"
                        defaultValue={editor}
                        readOnly
                    />
                </div>

                <div>
                    <div className="flex justify-between">
                        <label htmlFor="remarks" className="text-base">Remarks:</label>
                        {error.remarks && (
                            <span className="text-red-500 text-sm">
                                {error.remarks}
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="input w-full rounded-lg"
                        name="remarks"
                        id="remarks"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button type="button" className="btn btn-outline rounded-xl" onClick={() => setOpenUpdateModal(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn bg-gray-800 text-white rounded-xl">
                        Update
                    </button>
                </div>
            </Form>
        </div>

        <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setOpenUpdateModal(false)}
        />
    </dialog>
  )
}
