import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({
    setShowToast,
    setSuccessMessage,
    setOpenCreateInvoiceModal,
    hospitalId,
}) {
    const [error, setError] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <p className="text-2xl font-bold">Add Invoice</p>

                <Form
                    action={`/hospitals/${hospitalId}/invoices/store`}
                    method="post"
                    onSuccess={() => {
                        setOpenCreateInvoiceModal(false);
                        setShowToast(true);
                        setSuccessMessage(
                            `${invoiceNumber} added successfully`
                        );
                        setTimeout(() => setShowToast(false), 3000);
                    }}
                    onError={(error) => {
                        setError(error);
                    }}
                >
                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="invoice_number" className="text-md">
                                Invoice No.
                            </label>
                            {error.invoice_number && (
                                <span className="text-red-500 text-sm">
                                    {error.invoice_number}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="invoice_number"
                            id="invoice_number"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="document_date" className="text-md">
                                Document Date
                            </label>
                            {error.document_date && (
                                <span className="text-red-500 text-sm">
                                    {error.document_date}
                                </span>
                            )}
                        </div>
                        <input
                            type="date"
                            className="input w-full"
                            id="document_date"
                            name="document_date"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="due_date" className="text-md">
                                Due Date
                            </label>
                            {error.due_date && (
                                <span className="text-red-500 text-sm">
                                    {error.due_date}
                                </span>
                            )}
                        </div>
                        <input
                            type="date"
                            className="input w-full"
                            id="due_date"
                            name="due_date"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="amount" className="text-md">
                                Amount
                            </label>
                            {error.amount && (
                                <span className="text-red-500 text-sm">
                                    {error.amount}
                                </span>
                            )}
                        </div>
                        <input
                            type="number"
                            step="any"
                            placeholder="Type here"
                            className="input w-full"
                            name="amount"
                            id="amount"
                        />
                    </div>
                    
                    <div className="flex justify-end mt-6 gap-2">
                        <button
                            className="btn btn-outline rounded-xl"
                            onClick={() => {
                                setOpenCreateInvoiceModal(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn bg-gray-800 text-white rounded-xl "
                        >
                            Confirm
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenCreateInvoiceModal(false)}
            />
        </dialog>
    );
}
