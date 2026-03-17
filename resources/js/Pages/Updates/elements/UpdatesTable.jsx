import { router } from "@inertiajs/react";
import SortIcon from "../../components/SortIcon";
import { useState } from "react";
import { motion } from "framer-motion";
import Show from "../../Invoices/Show";

export default function UpdatesTable({ filters, latestUpdates }) {
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
    const [sortBy, setSortBy] = useState(filters.sort_by || "updated_at");
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const handleSort = (column) => {
        let newSortOrder = "asc";

        if (sortBy === column) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        setSortBy(column);
        setSortOrder(newSortOrder);

        router.get(
            "/updates",
            {
                sort_by: column,
                sort_order: newSortOrder,
                selected_area: filters.area || undefined,
                selected_status: filters.status || undefined,
                selected_user: filters.user || undefined,
            },
            { preserveState: true, preserveScroll: true },
        )
    }

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
        <table className="table w-full">
            <thead>
                <tr>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("invoice_number")}>
                        <div className="flex items-center gap-2">
                            Invoice No.
                            <SortIcon column="invoice_number" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("hospital_name")}>
                        <div className="flex items-center gap-2">
                            Hospital Name
                            <SortIcon column="hospital_name" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("amount")}>
                        <div className="flex items-center gap-2">
                            Amount
                            <SortIcon column="amount" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th>Remarks</th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("updated_by")}>
                        <div className="flex items-center gap-2">
                            Updated by
                            <SortIcon column="updated_by" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("processing_days")}>
                        <div className="flex items-center gap-2">
                            Processing Days
                            <SortIcon column="processing_days" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                {latestUpdates.data.map((update, index) => (
                    <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        key={update.id}
                    >
                        <td>
                            <span
                                className="hover:underline hover:cursor-pointer hover:text-blue-800"
                                onClick={() => {
                                    setSelectedInvoice(update.invoice);
                                    setOpenHistoryModal(true);
                                }}
                            >
                                {update.invoice.invoice_number}
                            </span>
                        </td>
                        <td>
                            <span
                                className="hover:underline hover:cursor-pointer hover:text-blue-800"
                                onClick={() => {
                                    router.get(`/hospitals/${update.invoice.hospital.id}/invoices`)
                                }}
                            >
                                {update.invoice.hospital.hospital_name}
                            </span>
                        </td>
                        <td>₱{parseFloat(update.invoice.amount).toLocaleString("en-PH", {minimumFractionDigits: 0, maximumFractionDigits: 2})}</td>
                        <td>{update.remarks}</td>
                        <td>{update.updater.name}</td>
                        <td>{update.invoice.processing_days}</td>
                    </motion.tr>
                ))}
            </tbody>
        </table>

        {openHistoryModal && (
            <Show
                invoice={selectedInvoice}
                setSelectedInvoice={setSelectedInvoice}
                setOpenHistoryModal={setOpenHistoryModal}
            />
        )}
    </div>
  )
}
