import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { router, usePage } from "@inertiajs/react";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { ListFilter, Pencil, Plus, Trash2, UserRoundPen, X } from "lucide-react";
import Create from "./Create";
import DeleteInvoiceModal from "./elements/DeleteInvoiceModal";
import { motion } from "framer-motion";
import Edit from "./Edit";
import Breadcrumbs from "../components/Breadcrumbs";
import UpdateInvoiceModal from "./elements/UpdateInvoiceModal";
import Show from "./Show";

export default function Index({
    invoices,
    hospital,
    searchQuery,
    editor,
    breadcrumbs,
    processingFilter,
    processingCounts,
    hospitalFilters,
    filters
}) {
    const [search, setSearch] = useState(searchQuery || "");
    const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
    const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [active, setActive] = useState(processingFilter);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [error, setError] = useState("");
    const { permissions } = usePage().props;
    const debouncedSearch = useDebounce(search, 300);
    
    const processingDays = [
        { label: "All", count: processingCounts?.["All"] || 0 },
        { label: "Current", count: processingCounts?.["Current"] || 0 },
        { label: "30 days", count: processingCounts?.["30 days"] || 0 },
        { label: "31-60 days", count: processingCounts?.["31-60 days"] || 0 },
        { label: "61-90 days", count: processingCounts?.["61-90 days"] || 0 },
        { label: "91-over", count: processingCounts?.["91-over"] || 0 },
    ];
    
    useEffect(() => {
        const allParams = { ...hospitalFilters };

        if (debouncedSearch.trim() !== "") {
            allParams.search = debouncedSearch;
            allParams.page = 1;
        } else {
            delete allParams.search;
        }

        router.get(
            `/hospitals/${hospital.id}/invoices`,
            allParams,
            {
                preserveState: true,
                replace: true,
                only: ["invoices"],
            },
        );
    }, [debouncedSearch]);

    const handleTabClick = (dayLabel) => {
        setActive(dayLabel);
        setSelectedIds([]);
        setIsSelectMode(false);

        const params = { ...hospitalFilters, page: 1 };

        if (dayLabel !== "All") {
            params.processing_days = dayLabel.replace(/ /g, "-");
        }

        router.get(
            `/hospitals/${hospital.id}/invoices`,
            params,
            { preserveScroll: true, preserveState: true },
        );
    }

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex items-center gap-2 justify-between pb-4">
                    <Breadcrumbs items={breadcrumbs} />
                    <SearchIt
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="tabs tabs-box">
                            {processingDays.map((day, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`px-4 border-b-0 rounded-2xl text-black tab gap-2 ${
                                        active === day.label
                                            ? "tab-active font-semibold"
                                            : "hover:bg-white hover:text-black"
                                    }`}
                                    onClick={() => handleTabClick(day.label)}
                                >
                                    {day.label}
                                    <div className="badge badge-sm bg-blue-200 border-none">
                                        {day.count}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {permissions.canUpdateInvoices && (
                                <button
                                    className="btn btn-outline border border-gray-300 rounded-xl"
                                    onClick={() => setOpenUpdateModal(true)}
                                    disabled={!isSelectMode}
                                >
                                    <UserRoundPen
                                        size={18}
                                        className="cursor-pointer"
                                    />
                                    <span>Update</span>
                                </button>
                            )}
                            {permissions.canManageInvoices && (
                                <>
                                    <button
                                        className="btn btn-primary rounded-xl"
                                        onClick={() => {
                                            setOpenCreateInvoiceModal(true);
                                        }}
                                    >
                                        <Plus size={16} />
                                        Add Invoice
                                    </button>
                                    <button
                                        className="btn btn-outline border border-gray-300 rounded-xl"
                                        onClick={() => setOpenDeleteModal(true)}
                                    >
                                        <Trash2
                                            size={18}
                                            className="cursor-pointer"
                                        />
                                        <span>Delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table table-fixed">
                            <thead>
                                <tr>
                                    {permissions.canUpdateInvoices && (
                                        <th className="w-[30px]">
                                            <input
                                                type="checkbox"
                                                className="checkbox w-5 h-5"
                                                checked={
                                                    selectedIds.length ===
                                                        invoices.data.length &&
                                                    invoices.data.length > 0
                                                }
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
                                    <th className="w-[50px]">Invoice No.</th>
                                    <th className="w-[60px]">Document Date</th>
                                    <th className="w-[50px]">Due Date</th>
                                    <th className="w-[50px]">Amount</th>
                                    <th className="w-[60px]">Processing Days</th>
                                    <th className="w-[50px]">Status</th>
                                    <th className="w-[200px]">Remarks</th>
                                    {permissions.canManageInvoices && (
                                        <th className="w-[20px] text-rights">
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
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.05,
                                        }}
                                        key={invoice.id}
                                        className={
                                            isSelectMode
                                                ? ""
                                                : "hover:bg-base-300 cursor-pointer"
                                        }
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
                                                    checked={selectedIds.includes(
                                                        invoice.id,
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
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
                                        <td>
                                            {new Date(
                                                invoice.document_date,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                invoice.due_date,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            ₱
                                            {parseFloat(
                                                invoice.amount,
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
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
                                                <div
                                                    className="flex justify-center items-center tooltip"
                                                    data-tip="Edit"
                                                >
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

                        {openCreateInvoiceModal && (
                            <Create
                                hospitalId={hospital.id}
                                setOpenCreateInvoiceModal={
                                    setOpenCreateInvoiceModal
                                }
                                setShowToast={setShowToast}
                                setSuccessMessage={setSuccessMessage}
                            />
                        )}

                        {openEditInvoiceModal && (
                            <Edit
                                invoice={selectedInvoice}
                                setOpenEditInvoiceModal={
                                    setOpenEditInvoiceModal
                                }
                                setShowToast={setShowToast}
                                setSuccessMessage={setSuccessMessage}
                            />
                        )}

                        {openDeleteModal && (
                            <DeleteInvoiceModal
                                setOpenDeleteModal={setOpenDeleteModal}
                                hospital={hospital}
                                setShowToast={setShowToast}
                                setSuccessMessage={setSuccessMessage}
                                selectedIds={selectedIds}
                                setSelectedIds={setSelectedIds}
                                setIsSelectMode={setIsSelectMode}
                                setError={setError}
                            />
                        )}

                        {openUpdateModal && (
                            <UpdateInvoiceModal
                                setOpenUpdateModal={setOpenUpdateModal}
                                setShowToast={setShowToast}
                                setSuccessMessage={setSuccessMessage}
                                setIsSelectMode={setIsSelectMode}
                                editor={editor}
                                selectedIds={selectedIds}
                                setSelectedIds={setSelectedIds}
                                hospital={hospital}
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

                        {showToast && (
                            <div className="toast toast-top toast-center">
                                <div className="alert alert-info">
                                    <span>{successMessage}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Pagination data={invoices} />
                </div>
            </div>
        </Master>
    );
}
