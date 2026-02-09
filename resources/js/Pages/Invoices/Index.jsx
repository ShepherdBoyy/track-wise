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
    filters
}) {
    const [search, setSearch] = useState(searchQuery || "");
    const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
    const [openEditInvoiceModal, setOpenEditInvoiceModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(filters.selected_status || "");
    const [selectedProcessingDays, setSelectedProcessingDays] = useState(filters.selected_processing_days || "");
    const [error, setError] = useState("");
    const { permissions } = usePage().props;
    const debouncedSearch = useDebounce(search, 300);
    
    useEffect(() => {
        const currentUrl = new URL(window.location.href);
        const allParams = {};

        currentUrl.searchParams.forEach((value, key) => {
            allParams[key] = value;
        })

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

    const handleApplyFilters = () => {
        const currentUrl = new URL(window.location.href);
        const allParams = {};

        currentUrl.searchParams.forEach((value, key) => {
            allParams[key] = value;
        })

        if (selectedStatus) {
            allParams.selected_status = selectedStatus;
        } else {
            delete allParams.selected_status;
        }

        if (selectedProcessingDays) {
            allParams.selected_processing_days = selectedProcessingDays;
        } else {
            delete allParams.selected_processing_days;
        }

        allParams.page = 1;

        router.get(
            `/hospitals/${hospital.id}/invoices`,
            allParams,
            { preserveState: true, preserveScroll: true },
        );
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setSelectedStatus("");
        setSelectedProcessingDays("");

        const currentUrl = new URL(window.location.href);
        const allParams = {};

        currentUrl.searchParams.forEach((value, key) => {
            allParams[key] = value;
        })

        delete allParams.selected_status;
        delete allParams.selected_processing_days;

        allParams.page = 1;

        router.get(
            `/hospitals/${hospital.id}/invoices`,
            allParams,
            { preserveState: true, preserveScroll: true },
        );

        setShowFilters(false);
    }

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex items-center gap-2 justify-between pb-4">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="flex justify-content-end gap-2">
                        <SearchIt
                            search={search}
                            setSearch={setSearch}
                        />
                        <button
                            className="btn btn-outline border border-gray-300 rounded-xl"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <ListFilter size={16} />
                            Filters
                        </button>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl">
                            Invoices
                        </span>
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

                    {showFilters && (
                        <div className="fixed top-0 right-0 h-full w-90 bg-base-100 shadow-lg pt-6 pb-18 px-6 z-50 transition-transform duration-300">
                            <div className="flex justify-between mb-6">
                                <p className="text-xl">Filter Options</p>
                                <X size={20} onClick={() => setShowFilters(false)} className="cursor-pointer" />
                            </div>
                            <div className="flex flex-col justify-between h-full">
                                <div className="flex flex-col justify-center gap-6">
                                    <div>
                                        <label className="label text-md">
                                            By Status
                                        </label>
                                        <select
                                            className="select w-full rounded-xl"
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="open">Open</option>
                                            <option value="overdue">Overdue</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="label text-md">
                                            By Processing Days
                                        </label>
                                        <select
                                            className="select w-full rounded-xl"
                                            value={selectedProcessingDays}
                                            onChange={(e) => setSelectedProcessingDays(e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="current">Current</option>
                                            <option value="thirty-days">30 days</option>
                                            <option value="sixty-days">31-60 days</option>
                                            <option value="ninety-days">61-90 days</option>
                                            <option value="over-ninety">91-over</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-center gap-2 ml-4">
                                    <button
                                        className="btn btn-outline rounded-3xl"
                                        onClick={handleClearFilters}
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        className="btn bg-gray-800 text-white rounded-3xl"
                                        onClick={handleApplyFilters}
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
