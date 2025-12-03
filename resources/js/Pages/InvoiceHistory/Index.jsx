import { Form, router } from "@inertiajs/react";
import Master from "../components/Master";
import { useState } from "react";
import { FileText } from "lucide-react";

export default function Index({ invoice, history, editor }) {
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");

    return (
        <Master>
            <div className="p-8 bg-base-200 ">
                {showToast && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-success">
                            <span>Updated Successfully</span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col bg-white p-6 rounded-xl">
                    <div className="flex justify-between cursor-pointer items-center mb-4">
                        <span className="text-2xl">
                            {invoice.hospital.hospital_name}
                        </span>
                        <a
                            href={`/hospitals/${invoice.hospital.id}/invoices/${invoice.id}/history/download`}
                            target="_blank"
                            className="flex items-center btn gap-1 p-2 tooltip"
                            data-tip="View PDF"
                        >
                            <FileText />
                            <span>PDF</span>
                        </a>
                    </div>
                    <div className="grid grid-cols-3 auto-rows-min gap-4">
                        <div className="row-span-1 border rounded-xl border-gray-300">
                            <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                {invoice.invoice_number}
                            </div>
                            <div className="grid grid-cols-2 gap-y-8 p-6">
                                <div>
                                    <p className="text-sm opacity-60 mb-1">
                                        Status
                                    </p>
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
                                    <p className="text-sm opacity-60 mb-1">
                                        Amount
                                    </p>
                                    <p className="text-md">
                                        ₱
                                        {parseFloat(
                                            invoice.amount
                                        ).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm opacity-60 mb-1">
                                        Document Date
                                    </p>
                                    <p className="text-md">
                                        {new Date(
                                            invoice.document_date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm opacity-60 mb-1">
                                        Due Date
                                    </p>
                                    <p className="text-md">
                                        {new Date(
                                            invoice.due_date
                                        ).toLocaleDateString()}
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
                                        <label
                                            htmlFor="updated_by"
                                            className="text-base"
                                        >
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
                                        <label
                                            htmlFor="description"
                                            className="text-base"
                                        >
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
                                    >
                                        <option value="" disabled>
                                            Select
                                        </option>
                                        <option>
                                            Invoice remains open pending
                                            verification of the submitted
                                            billing documents; awaiting
                                            confirmation from the hospital's
                                            finance team
                                        </option>
                                        <option>
                                            Payment is currently under review
                                            due to discrepancies found in the
                                            itemized charges; vendor has been
                                            notified for clarification
                                        </option>
                                        <option>
                                            Processing is delayed because
                                            supporting documents were
                                            incomplete; waiting for the client
                                            to provide the missing requirements
                                        </option>
                                        <option>
                                            Invoice cannot be closed yet as the
                                            payment request has not been
                                            approved by the authorized signatory
                                        </option>
                                        <option>
                                            Status remains open while
                                            coordination with the accounting
                                            department is ongoing to resolve
                                            amount differences before final
                                            closure
                                        </option>
                                    </select>
                                </fieldset>
                                <div className="flex justify-end">
                                    <button className="btn btn-primary w-5xs rounded-xl">
                                        Update
                                    </button>
                                </div>
                            </Form>
                        </div>

                        <div className="col-span-3 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                            <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                History
                            </div>
                            <div className="p-4">
                                <table className="table table-md">
                                    <thead className="">
                                        <tr>
                                            <th>Updated At</th>
                                            <th>Updated By</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((item, index) => (
                                            <tr key={index}>
                                                <td className="w-[150px]">
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="w-[250px]">
                                                    {item.updater.name}
                                                </td>
                                                <td>{item.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
