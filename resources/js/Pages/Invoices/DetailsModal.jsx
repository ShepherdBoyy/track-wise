import { Building2, FileText } from "lucide-react";

export default function DetailsModal({
    selectedInvoice,
    setSelectedInvoice,
    setOpen,
    hospitalName,
}) {
    return (
        <dialog open className="modal">
            <div className="modal-box max-w-5xl p-0 rounded-2xl overflow-hidden shadow-xl ">
                <div className="bg-linear-to-br from-primary/10 to-base-200 p-8 border-b border-base-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl">Invoice Details</h1>
                            <p className="text-xs opacity-60 mt-1">
                                Complete invoice information and history
                            </p>
                        </div>

                        <div className="text-right mt-4 sm:mt-0">
                            <p className="text-xs opacity-60 uppercase">
                                Invoice No.
                            </p>
                            <p className="font-semi-bold text-lg">
                                {selectedInvoice.invoice_number}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm  opacity-60 mb-1">
                                Issued by
                            </p>
                            <p className="text-md">
                                {selectedInvoice.creator.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm  opacity-60 mb-1">
                                Created At
                            </p>
                            <p className="">
                                {new Date(
                                    selectedInvoice.created_at
                                ).toLocaleDateString("en-PH", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60 mb-1">Hospital</p>
                            <div className="flex items-center gap-2 text-md">
                                {/* <Building2 className="w-4 h-4 text-primary" /> */}
                                {hospitalName}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm  opacity-60 mb-1">Status</p>
                            <span
                                className={`badge badge-md text-sm rounded-full   ${
                                    selectedInvoice.status === "closed"
                                        ? "bg-emerald-100 text-emerald-700 border-green-600"
                                        : selectedInvoice.status === "open"
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                        : selectedInvoice.status === "overdue"
                                        ? "bg-red-100 text-red-700 border-red-600"
                                        : "badge-neutral"
                                }`}
                            >
                                {selectedInvoice.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm   opacity-60 mb-1">
                                Transaction Date
                            </p>
                            <p className="text-md">
                                {new Date(
                                    selectedInvoice.transaction_date
                                ).toLocaleDateString("en-PH", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm   opacity-60 mb-1">
                                Date Closed
                            </p>
                            <p className="font-semibold">
                                {selectedInvoice.date_closed
                                    ? new Date(
                                          selectedInvoice.date_closed
                                      ).toLocaleDateString("en-PH", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      })
                                    : "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm   opacity-60 mb-1">Amount</p>
                            <div className="flex gap-2 items-center text-base font-medium">
                                ₱
                                {parseFloat(
                                    selectedInvoice.amount
                                ).toLocaleString("en-PH", {
                                    minimumFractionDigits: 2,
                                })}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5" />
                            <h2 className="text-xl">Update History</h2>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                            <table className="table table-md">
                                <thead className="bg-base-200 text-base-content/80 text-xs uppercase">
                                    <tr>
                                        <th>Updated At</th>
                                        <th>Updated By</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="w-[150px]">
                                            {new Date(
                                                selectedInvoice.updated_at
                                            ).toLocaleDateString("en-PH", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="w-[200px]">
                                            {selectedInvoice.updater.name}
                                        </td>
                                        <td>{selectedInvoice.description}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => {
                    setOpen(false);
                    setSelectedInvoice(null);
                }}
            />
        </dialog>
    );
}
