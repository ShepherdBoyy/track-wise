import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function CreateInvoiceModal({
    setShowToast,
    setSuccessMessage,
    setOpenCreateInvoiceModal
}) {
    const [error, setError] = useState("");
    const [hospitalName, setHospitalName] = useState("");

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <p className="text-2xl font-bold">Add Invoice</p>

                <Form
                    action="/hospitals/invoices/store"
                    method="post"
                    transform={(data) => ({
                        ...data,
                        hospital_id: hospitalId,
                    })}
                >
                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="invoice_number" className="text-md">
                                Invoice No.
                            </label>
                            {/* {error && (
                                    <span className="text-red-500 text-sm">
                                        {error}
                                    </span>
                                )} */}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input"
                            name="invoice_number"
                            id="invoice_number"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="amount" className="text-md">
                                Amount
                            </label>
                            {/* {error && (
                                    <span className="text-red-500 text-sm">
                                        {error}
                                    </span>
                                )} */}
                        </div>
                        <input
                            type="number"
                            step="any"
                            placeholder="Type here"
                            className="input"
                            name="amount"
                            id="amount"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <label htmlFor="status" className="text-md">
                            Status
                        </label>
                        <fieldset className="fieldset">
                            <select
                                className="select"
                                defaultValue="default"
                                name="status"
                                id="status"
                            >
                                <option value="default" disabled>
                                    Select Status
                                </option>
                                <option value="open">Open</option>
                                <option value="closed">Closed</option>
                            </select>
                        </fieldset>
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label
                                htmlFor="transaction_date"
                                className="text-md"
                            >
                                Transaction Date
                            </label>
                            {/* {error && (
                                    <span className="text-red-500 text-sm">
                                        {error}
                                    </span>
                                )} */}
                        </div>
                        <input
                            type="date"
                            className="input"
                            id="transaction_date"
                            name="transaction_date"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn bg-gray-800 text-white rounded-xl mt-8"
                    >
                        Confirm
                    </button>
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
