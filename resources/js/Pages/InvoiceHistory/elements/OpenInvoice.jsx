import React, { useState } from "react";
import HistoryTable from "./historyTable";
import { Form, usePage } from "@inertiajs/react";

export default function OpenInvoice({
    invoice,
    history,
    editor,
    error,
    setError,
    setShowToast,
}) {
    const { permissions } = usePage().props;

    const [showCustomDescription, setShowCustomDescription] = useState(false);
    const [customDescription, setCustomDescription] = useState("");

    return (
        <div className="grid grid-cols-3 auto-rows-min gap-4">
            <div className="row-span-1 border rounded-xl border-gray-300">
                <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                    {invoice.invoice_number}
                </div>
                <div className="grid grid-cols-2 gap-y-8 p-6">
                    <div>
                        <p className="text-sm opacity-60 mb-1">Status</p>
                        <span
                            className={`badge badge-md text-sm rounded-full   ${
                                invoice.status === "closed"
                                    ? "bg-emerald-100 text-emerald-700 border-green-600"
                                    : invoice.status === "open"
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                      : invoice.status === "overdue"
                                        ? "bg-red-100 text-red-700 border-red-600"
                                        : "badge-neutral"
                            }`}
                        >
                            {invoice.status}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm opacity-60 mb-1">Amount</p>
                        <p className="text-md">
                            ₱
                            {parseFloat(invoice.amount).toLocaleString(
                                "en-PH",
                                {
                                    minimumFractionDigits: 2,
                                },
                            )}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm opacity-60 mb-1">Document Date</p>
                        <p className="text-md">
                            {new Date(
                                invoice.document_date,
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm opacity-60 mb-1">Due Date</p>
                        <p className="text-md">
                            {new Date(invoice.due_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-span-2 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                    Update Invoice
                </div>
                <Form
                    className="flex flex-col gap-6 p-6"
                    action={`/hospitals/${invoice.hospital.id}/invoices/${invoice.id}/history/store`}
                    method="post"
                    resetOnSuccess
                    options={{
                        preserveScroll: true,
                        preserveState: true,
                    }}
                    onSuccess={() => {
                        setShowToast(true);
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
                            disabled={!permissions.canManageInvoiceHistory}
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
                            disabled={!permissions.canManageInvoiceHistory}
                            onChange={(e) => {
                                setShowCustomDescription(
                                    e.target.value === "others",
                                );
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
                    </fieldset>
                    <div className={`flex ${showCustomDescription ? "justify-between gap-4" : "justify-end"}`}>
                        {showCustomDescription && (
                            <input
                                placeholder="Enter Custom Description"
                                name="description"
                                className="input rounded-xl w-full"
                                value={customDescription}
                                onChange={(e) =>
                                    setCustomDescription(e.target.value)
                                }
                            />
                        )}
                        <button
                            className="btn btn-primary w-5xs rounded-xl"
                            disabled={!permissions.canManageInvoiceHistory}
                        >
                            Update
                        </button>
                    </div>
                </Form>
            </div>

            <HistoryTable history={history} invoice={invoice} />
        </div>
    );
}
