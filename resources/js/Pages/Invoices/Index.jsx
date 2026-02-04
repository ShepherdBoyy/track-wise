import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { router, usePage } from "@inertiajs/react";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { Pencil, Plus, Trash2, UserRoundPen } from "lucide-react";
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
    processingFilter,
    filterCounts,
    filterTotals,
    breadcrumbs,
}) {
    const [search, setSearch] = useState(searchQuery || "");
    const [active, setActive] = useState(processingFilter);
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
    const [error, setError] = useState("");
    const { permissions } = usePage().props;
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                `/hospitals/${hospital.id}/invoices`,
                {
                    search: debouncedSearch,
                    processing_days: active.replace(/ /g, "-"),
                },
                {
                    preserveState: true,
                    replace: true,
                    only: ["invoices"],
                },
            );
        } else {
            router.get(
                `/hospitals/${hospital.id}/invoices`,
                {
                    processing_days: active.replace(/ /g, "-"),
                },
                {
                    preserveState: true,
                    replace: true,
                    only: ["invoices"],
                },
            );
        }
    }, [debouncedSearch]);

    const processingDays = [
        { label: "Current", invoices_count: filterCounts.current, total_amount: filterTotals.current },
        { label: "30 days", invoices_count: filterCounts.thirty_days, total_amount: filterTotals.thirty_days },
        { label: "31-60 days", invoices_count: filterCounts.sixty_days, total_amount: filterTotals.sixty_days },
        { label: "61-90 days", invoices_count: filterCounts.ninety_days, total_amount: filterTotals.ninety_days },
        { label: "91-over", invoices_count: filterCounts.over_ninety, total_amount: filterTotals.over_ninety },
        { label: "Closed", invoices_count: filterCounts.closed, total_amount: filterTotals.closed },
    ];

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
                    <div className="flex justify-between items-center mb-3">
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
                                    onClick={() => {
                                        setActive(day.label);
                                        setSelectedIds([]);
                                        setIsSelectMode(false);
                                        router.get(
                                            `/hospitals/${hospital.id}/invoices`,
                                            {
                                                processing_days: day.label.replace(/ /g, "-"),
                                            },
                                            {
                                                preserveScroll: true,
                                                preserveState: true,
                                                only: ["invoices"],
                                            },
                                        );
                                    }}
                                >
                                    {day.label}
                                    <div className="badge badge-sm bg-blue-200 border-none">
                                        {day.invoices_count}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            {permissions.canManageInvoices && (
                                <button
                                    className="btn btn-primary rounded-xl"
                                    onClick={() => {
                                        setOpenCreateInvoiceModal(true);
                                    }}
                                >
                                    <Plus size={16} />
                                    Add Invoice
                                </button>
                            )}
                            {isSelectMode && permissions.canManageInvoices && (
                                <>
                                    <button
                                        className="btn btn-outline border border-gray-300 rounded-xl"
                                        onClick={() => setOpenUpdateModal(true)}
                                    >
                                        <UserRoundPen
                                            size={18}
                                            className="cursor-pointer"
                                        />
                                        <span>Update</span>
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
                                    {permissions.canManageInvoices && (
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
                                                    if (
                                                        e.target.checked &&
                                                        invoices.data.length > 0
                                                    ) {
                                                        setIsSelectMode(true);
                                                        setSelectedIds(
                                                            invoices.data.map(
                                                                (i) => i.id,
                                                            ),
                                                        );
                                                    } else {
                                                        setSelectedIds([]);
                                                        setIsSelectMode(false);
                                                    }
                                                }}
                                            />
                                        </th>
                                    )}
                                    <th className="w-[50px]">Invoice No.</th>
                                    <th className="w-[70px]">Document Date</th>
                                    <th className="w-[50px]">Due Date</th>
                                    <th className="w-[80px]">Amount</th>
                                    <th className="w-[60px]">Processing Days</th>
                                    <th className="w-[60px]">Status</th>
                                    <th className="w-[190px]">Description</th>
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
                                        {permissions.canManageInvoices && (
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
                                        <td className="truncate">{invoice.latest_history.description}</td>
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
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className="text-right text-sm font-semibold">Total Amount: </td>
                                    <td>
                                        ₱
                                        {parseFloat(
                                            processingDays.find(day => day.label === active)?.total_amount || 0
                                        ).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            </tfoot>
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
