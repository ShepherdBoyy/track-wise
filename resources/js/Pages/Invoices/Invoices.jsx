import { useState } from "react";
import Master from "../components/Master";
import { Eye } from "lucide-react";
import DetailsModal from "./DetailsModal";

export default function Invoices() {
    const [open, setOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const invoices = [
        {
            id: 1,
            customerName: "Cy Ganderton",
            invoiceNo: "INV-001",
            amount: "$250",
            status: "Paid",
            transactionDate: "2025-11-12",
            createdBy: "Truly Yours ",
        },
        {
            id: 2,
            customerName: "Hart Hagerty",
            invoiceNo: "INV-002",
            amount: "$300",
            status: "Pending",
            transactionDate: "2025-11-13",
            createdBy: "Jhey",
        },
        {
            id: 3,
            customerName: "Hart Hagerty",
            invoiceNo: "INV-002",
            amount: "$300",
            status: "Pending",
            transactionDate: "2025-11-13",
            createdBy: "Jhey",
        },
    ];

    return (
        <Master>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Invoice No.</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Transaction Date</th>
                            <th>Created By</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr key={invoice.id}>
                                <td>{index + 1}</td>
                                <td>{invoice.customerName}</td>
                                <td>{invoice.invoiceNo}</td>
                                <td>{invoice.amount}</td>
                                <td className="text-left">
                                    <span
                                        className={`inline-block px-2.5 py-1 text-sm font-medium rounded-full ${
                                            invoice.status === "Paid"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : invoice.status === "Pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {invoice.status}
                                    </span>
                                </td>

                                <td>{invoice.transactionDate}</td>
                                <td>{invoice.createdBy}</td>
                                <td>
                                    <button
                                        className="btn btn-sm bg-blue-300"
                                        onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setOpen(true);
                                        }}
                                    >
                                        <Eye className="size-4.5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {open && (
                    <DetailsModal
                        selectedInvoice={selectedInvoice}
                        setSelectedInvoice={setSelectedInvoice}
                        setOpen={setOpen}
                    />
                )}
            </div>
        </Master>
    );
}
