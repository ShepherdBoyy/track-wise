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
    const [showCustomDescription, setShowCustomDescription] = useState(false);
    const [customDescription, setCustomDescription] = useState("");

  return (
    <dialog open className="modal">
        <div className="modal-box">
            <p className="text-lg font-bold text-center">Update Invoice</p>
            <Form
                className="flex flex-col gap-6"
                action={`/hospitals/${hospital.id}/invoices/update-history`}
                transform={data => ({ ...data, ids: selectedIds })}
                method="post"
                resetOnSuccess
                options={{
                    preserveScroll: true,
                    preserveState: true,
                }}
                onSuccess={() => {
                    setSelectedIds([]);
                    setOpenUpdateModal(false);
                    setIsSelectMode(false);
                    setShowToast(true);
                    setSuccessMessage(`Sucessfully updated ${selectedIds.length} invoices`);
                    setTimeout(() => setShowToast(false), 3000);
                    setError("");
                }}
                onError={(error) => {
                    setError(error);
                }}
            >
                <div>
                    <div className="flex justify-between">
                        <label htmlFor="updated_by" className="text-base">
                            Update By:
                        </label>
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

                <fieldset className="fieldset">
                    <div className="flex justify-between">
                        <label htmlFor="description" className="text-base">
                            Description:
                        </label>
                        {error.description && (
                            <span className="text-red-500 text-sm">
                                {error.description}
                            </span>
                        )}
                    </div>
                    <select
                        defaultValue=""
                        className="select rounded-xl w-full"
                        name="description"
                        id="description"
                        onChange={(e) => {
                            setShowCustomDescription(e.target.value === "others");
                            if (e.target.value !== "others") {
                                setCustomDescription("");
                            }
                        }}
                    >
                        <option value="" disabled>
                            Select
                        </option>
                        <option>
                            Invoice remains open pending verification of the
                            submitted billing documents; awaiting
                            confirmation from the hospital's finance team
                        </option>
                        <option>
                            Payment is currently under review due to
                            discrepancies found in the itemized charges;
                            vendor has been notified for clarification
                        </option>
                        <option>
                            Processing is delayed because supporting
                            documents were incomplete; waiting for the
                            client to provide the missing requirements
                        </option>
                        <option>
                            Invoice cannot be closed yet as the payment
                            request has not been approved by the authorized
                            signatory
                        </option>
                        <option>
                            Status remains open while coordination with the
                            accounting department is ongoing to resolve
                            amount differences before final closure
                        </option>
                        <option value="others">Others</option>
                        <option value="closed">Close Invoice</option>
                    </select>

                    {showCustomDescription && (
                        <input
                            placeholder="Type here"
                            name="description"
                            className="input rounded-xl w-full mt-2"
                            value={customDescription}
                            onChange={(e) =>
                                setCustomDescription(e.target.value)
                            }
                        />
                    )}
                </fieldset>
                <div className="flex justify-end gap-2">
                    <button
                        className="btn btn-outline rounded-xl"
                        onClick={() => setOpenUpdateModal(false)}
                    >
                        Cancel
                    </button>
                    <button className="btn bg-gray-800 text-white rounded-xl">
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
