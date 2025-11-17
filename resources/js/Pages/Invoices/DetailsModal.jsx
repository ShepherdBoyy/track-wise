import {
    Building2,
    FileText,
} from "lucide-react";

export default function DetailsModal({
    selectedInvoice,
    setSelectedInvoice,
    setOpen,
    hospitalName,
}) {
    return (
        <dialog open className="modal">
            <div className="modal-box max-w-4xl p-0 rounded-2xl overflow-hidden shadow-xl">
                
                <div className="bg-gradient-to-br from-primary/10 to-base-200 p-8 border-b border-base-300">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold tracking-wide">
                                INVOICE DETAILS
                            </h1>
                            <p className="text-xs opacity-60 mt-1">
                                Complete invoice information and history
                            </p>
                        </div>

                        <div className="text-right mt-4 sm:mt-0">
                            <p className="text-xs opacity-60 uppercase">
                                Invoice No.
                            </p>
                            <p className="font-bold text-lg">
                                {selectedInvoice.invoice_number}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs uppercase opacity-60 mb-1">
                                Created By / At
                            </p>
                            <p className="font-semibold">
                                {selectedInvoice.creator.name}
                            </p>
                            <p className="text-xs opacity-60">
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
                            <p className="text-xs uppercase opacity-60 mb-1">
                                Hospital
                            </p>
                            <div className="flex items-center gap-2 font-semibold">
                                <Building2 className="w-4 h-4 text-primary" />
                                {hospitalName}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs uppercase opacity-60 mb-1">
                                Status
                            </p>
                            <span
                                className={`badge badge-lg font-semibold ${
                                    selectedInvoice.status === "Paid"
                                        ? "badge-success"
                                        : selectedInvoice.status === "Pending"
                                        ? "badge-warning"
                                        : "badge-neutral"
                                }`}
                            >
                                {selectedInvoice.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs uppercase opacity-60 mb-1">
                                Transaction Date
                            </p>
                            <p className="font-semibold">
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
                            <p className="text-xs uppercase opacity-60 mb-1">
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
                            <p className="text-xs uppercase opacity-60 mb-1">
                                Amount
                            </p>
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
                            <h2 className="font-bold text-xl tracking-wide">
                                Update History
                            </h2>
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
