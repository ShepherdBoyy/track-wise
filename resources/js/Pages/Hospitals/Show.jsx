import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { router } from "@inertiajs/react";
import DetailsModal from "./elements/DetailsModal";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { Plus } from "lucide-react";
import CreateInvoiceModal from "./elements/CreateInvoiceModal";

export default function Show({
    invoices,
    hospital,
    searchQuery,
    processingFilter,
    invoicesCount,
}) {
    const [open, setOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [search, setSearch] = useState(searchQuery || "");
    const [active, setActive] = useState(processingFilter);
    const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                `/hospitals/invoices/${hospital.id}/${processingFilter}/${invoicesCount}`,
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    const processingDays = [
        { label: "30 days" },
        { label: "31-60 days" },
        { label: "61-90 days" },
        { label: "91-over" },
    ];

    return (
        <Master>
            <div className=" bg-base-200 ">
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2 ">
                        <div className="flex items-center gap-x-3">
                            <h1 className="flex-1 text-3xl">
                                {hospital ? `${hospital.hospital_name}` : ""}
                            </h1>
                            {invoicesCount && (
                                <div className="badge badge-sm badge-primary">
                                    {invoicesCount} invoices
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <button
                                className="btn btn-primary rounded-xl"
                                onClick={() => {
                                    setOpenCreateInvoiceModal(true);
                                }}
                            >
                                Add Invoice
                                <Plus size={16} />
                            </button>
                            <fieldset className="fieldset w-36 ">
                                <select
                                    defaultValue="Filter By Age"
                                    className="select rounded-xl"
                                >
                                    <option disabled={true}>
                                        Filter By Days
                                    </option>
                                    {processingDays.map((day, index) => (
                                        <option
                                            key={index}
                                            onClick={() => {
                                                setActive(day.label);
                                                router.get(
                                                    `/hospitals/invoices/${
                                                        hospital.id
                                                    }/${day.label.replace(
                                                        / /g,
                                                        "-"
                                                    )}/${invoicesCount}`,
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
                            <div className="flex justify-content-end">
                                <SearchIt
                                    search={search}
                                    setSearch={setSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Invoice No.</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Transaction Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoices.data.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        className="hover:bg-base-300 cursor-pointer"
                                        onClick={() => {
                                            setSelectedInvoice(invoice);
                                            setOpen(true);
                                        }}
                                    >
                                        <td>{index + 1}</td>
                                        <td>{invoice.invoice_number}</td>
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
                                        <td>
                                            {new Date(
                                                invoice.transaction_date
                                            ).toLocaleDateString()}
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
            </div>
        </Master>
    );
}
