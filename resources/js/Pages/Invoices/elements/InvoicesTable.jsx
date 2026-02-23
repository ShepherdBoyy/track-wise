import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import Edit from "../Edit";
import { useState } from "react";
import Show from "../Show";

export default function InvoicesTable({
    isSelectMode,
    setIsSelectMode,
    selectedIds,
    setSelectedIds,
    invoices, 
    setShowToast,
    setSuccessMessage,
    active
}) {
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const { permissions } = usePage().props;

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
        <table className="table w-full">
            <thead>
                <tr>
                    {permissions.canUpdateInvoices && (
                        <th className="w-[40px]">
                            <input
                                type="checkbox"
                                className="checkbox w-5 h-5"
                                checked={selectedIds.length === invoices.data.length && invoices.data.length > 0}
                                onChange={(e) => {
                                    if (e.target.checked && invoices.data.length > 0) {
                                        setIsSelectMode(true);
                                        setSelectedIds(invoices.data.map((i) => i.id));
                                    } else {
                                        setSelectedIds([]);
                                        setIsSelectMode(false);
                                    }
                                }}
                            />
                        </th>
                    )}
                    <th>Invoice No.</th>
                    <th>Document Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Processing Days</th>
                    <th>Status</th>
                    <th>Remarks</th>
                    {permissions.canManageInvoices && (
                        <th className="text-right">
                            Action
                        </th>
                    )}
                </tr>
            </thead>

            <tbody>
                {invoices.data.map((invoice, index) => (
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        key={invoice.id}
                        className={isSelectMode ? "" : "hover:bg-base-300 cursor-pointer"}
                        onClick={() => {
                            if(!isSelectMode) {
                                setSelectedInvoice(invoice);
                                setOpenHistoryModal(true);
                            }
                        }}
                    >
                        {permissions.canUpdateInvoices && (
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox w-5 h-5"
                                    checked={selectedIds.includes(invoice.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds([...selectedIds, invoice.id]);
                                            setIsSelectMode(true);
                                        } else {
                                            const newSelected = selectedIds.filter((id) => id !== invoice.id);
                                            setSelectedIds(newSelected);
                                            setIsSelectMode(newSelected.length > 0);
                                        }
                                    }}
                                />
                            </td>
                        )}
                        <td>{invoice.invoice_number}</td>
                        <td>{new Date(invoice.document_date).toLocaleDateString()}</td>
                        <td>{new Date(invoice.due_date).toLocaleDateString()}</td>
                        <td>₱{parseFloat(invoice.amount).toLocaleString("en-PH", {minimumFractionDigits: 2})}</td>
                        <td>{invoice.processing_days}</td>
                        <td>
                            <span className={`badge badge-md text-sm rounded-full   ${
                                invoice.status === "closed"
                                    ? "bg-emerald-100 text-emerald-700 border-green-600"
                                    : invoice.status === "open"
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                    : invoice.status === "overdue"
                                        ? "bg-red-100 text-red-700 border-red-600"
                                        : "badge-neutral"
                            }`}>
                                {invoice.status}
                            </span>
                        </td>
                        <td className="truncate">{invoice.latest_history.remarks}</td>
                        {permissions.canManageInvoices && (
                            <td>
                                <div className="flex justify-center items-center tooltip" data-tip="Edit">
                                    <Pencil
                                        size={18}
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenEditInvoiceModal(true);
                                            setSelectedInvoice(invoice);
                                        }}
                                    />
                                </div>
                            </td>
                        )}
                    </motion.tr>
                ))}
            </tbody>
        </table>

        {openEditInvoiceModal && (
            <Edit
                invoice={selectedInvoice}
                setOpenEditInvoiceModal={setOpenEditInvoiceModal}
                setShowToast={setShowToast}
                setSuccessMessage={setSuccessMessage}
            />
        )}

        {openHistoryModal && (
            <Show
                history={selectedInvoice.history}
                invoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                setOpenHistoryModal={setOpenHistoryModal}
            />
        )}

    </div>
  )
}
