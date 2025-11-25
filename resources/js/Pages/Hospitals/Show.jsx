import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { router } from "@inertiajs/react";
import DetailsModal from "./elements/DetailsModal";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import CreateInvoiceModal from "./elements/CreateInvoiceModal";

export default function Show({
    invoices,
    hospital,
    searchQuery,
    processingFilter,
}) {
    const [open, setOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [search, setSearch] = useState(searchQuery || "");
    const [active, setActive] = useState(processingFilter);
    const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [error, setError] = useState("");

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                `/hospitals/${hospital.id}/invoices/${processingFilter}`,
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    const processingDays = [
        { label: "Current" },
        { label: "30 days" },
        { label: "31-60 days" },
        { label: "61-90 days" },
        { label: "91-over" },
        { label: "Closed" },
    ];

    return (
        <Master>
            <div className=" bg-base-200 ">
                <div className="flex items-center gap-2 justify-between pb-4">
                    <fieldset className="fieldset w-36">
                        <select
                            defaultValue="Filter By Age"
                            className="select rounded-xl"
                        >
                            <option disabled={true}>Filter By Days</option>
                            {processingDays.map((day, index) => (
                                <option
                                    key={index}
                                    onClick={() => {
                                        setActive(day.label);
                                        router.get(
                                            `/hospitals/${
                                                hospital.id
                                            }/invoices/${day.label.replace(
                                                / /g,
                                                "-"
                                            )}`,
                                            {},
                                            { preserveState: true }
                                        );
                                    }}
                                >
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                    <SearchIt
                        search={search}
                        setSearch={setSearch}
                        name="Invoice No."
                    />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2 ">
                        <div className="flex items-center gap-x-3">
                            <h1 className="flex-1 text-3xl">
                                {hospital.hospital_name}
                            </h1>
                            <div className="badge badge-sm badge-primary">
                                {hospital.invoices_count} invoices
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <button
                                className="btn btn-outline rounded-xl"
                                onClick={() => {
                                    setIsDeleteMode(true);
                                    setSelectedIds([]);
                                }}
                            >
                                <Trash2 size={18} className="cursor-pointer" />
                            </button>
                            <button
                                className="btn btn-primary rounded-xl"
                                onClick={() => {
                                    setOpenCreateInvoiceModal(true);
                                }}
                            >
                                Add Invoice
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="rounded-box border border-base-content/5 bg-base-100 pt-5 ">
                        <table className="table table-fixed ">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">
                                        {isDeleteMode ? (
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={
                                                    selectedIds.length ===
                                                        invoices.data.length &&
                                                    invoices.data.length > 0
                                                }
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds(
                                                            invoices.data.map(
                                                                (i) => i.id
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedIds([]);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            "#"
                                        )}
                                    </th>
                                    <th className="w-1/4">Invoice No.</th>
                                    <th className="w-1/4">Document Date</th>
                                    <th className="w-1/4">Due Date</th>
                                    <th className="w-1/4">Amount</th>
                                    <th className="w-1/4">Status</th>
                                    <th className="w-1/4">Processing Days</th>
                                    <th className="w-1/4">Issued By</th>
                                    <th className="w-1/8">Created At</th>
                                    <th className="w-1/5 text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoices.data.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-base-300"
                                    >
                                        <td>
                                            {isDeleteMode ? (
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    checked={selectedIds.includes(
                                                        invoice.id
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedIds([
                                                                ...selectedIds,
                                                                invoice.id,
                                                            ]);
                                                        } else {
                                                            setSelectedIds(
                                                                selectedIds.filter(
                                                                    (id) =>
                                                                        id !==
                                                                        invoice.id
                                                                )
                                                            );
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                index + 1
                                            )}
                                        </td>
                                        <td>{invoice.invoice_number}</td>
                                        <td>
                                            {new Date(
                                                invoice.document_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            {new Date(
                                                invoice.due_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            ₱
                                            {parseFloat(
                                                invoice.amount
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="text-left">
                                            <span
                                                className={`badge badge-md text-sm rounded-full ${
                                                    invoice.status.toLowerCase() ===
                                                    "closed"
                                                        ? "bg-emerald-100 text-emerald-700 border-green-600"
                                                        : invoice.status.toLowerCase() ===
                                                          "open"
                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                                        : invoice.status.toLowerCase() ===
                                                          "overdue"
                                                        ? "bg-red-100 text-red-700 border-red-600"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td>{invoice.processing_days}</td>
                                        <td>{invoice.creator.name}</td>
                                        <td>
                                            {new Date(
                                                invoice.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-3 items-center justify-end">
                                                <div
                                                    className="tooltip"
                                                    data-tip="View"
                                                >
                                                    <Eye
                                                        size={18}
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedInvoice(
                                                                invoice
                                                            );
                                                            setOpen(true);
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className="tooltip"
                                                    data-tip="Edit"
                                                >
                                                    <Pencil
                                                        size={18}
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            router.get(
                                                                `/hospitals/invoices/${invoice.id}/edit`,
                                                                {},
                                                                {
                                                                    preserveState: true,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {open && (
                            <DetailsModal
                                selectedInvoice={selectedInvoice}
                                hospitalName={
                                    hospital?.hospital_name ||
                                    selectedInvoice?.hospital?.hospital_name
                                }
                                setSelectedInvoice={setSelectedInvoice}
                                setOpen={setOpen}
                            />
                        )}

                        {openCreateInvoiceModal && (
                            <CreateInvoiceModal
                                hospitalId={hospital.id}
                                setOpenCreateInvoiceModal={
                                    setOpenCreateInvoiceModal
                                }
                                setShowToast={setShowToast}
                                setSuccessMessage={setSuccessMessage}
                            />
                        )}

                        {showToast && (
                            <div className="toast toast-top toast-center">
                                <div className="alert alert-success">
                                    <span>{successMessage}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <Pagination data={invoices} />
                </div>

                {isDeleteMode && (
                    <div className="flex justify-center gap-3 mt-5">
                        <button
                            className="btn btn-error text-white rounded-xl"
                            disabled={selectedIds.length === 0}
                            onClick={() => {
                                router.post(
                                    `/hospitals/${hospital.id}/invoices/delete`,
                                    { ids: selectedIds },
                                    {
                                        onSuccess: () => {
                                            setIsDeleteMode(false);
                                            setSelectedIds([]);
                                            setShowToast(true);
                                            setSuccessMessage(
                                                "Successfully Deleted"
                                            );
                                            setTimeout(
                                                () => setShowToast(false),
                                                3000
                                            );
                                        },
                                        onError: (error) => {
                                            setError(error);
                                        },
                                    }
                                );
                            }}
                        >
                            Confirm
                        </button>
                        <button
                            className="btn rounded-xl"
                            onClick={() => {
                                setIsDeleteMode(false);
                                setSelectedIds([]);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </Master>
    );
}
