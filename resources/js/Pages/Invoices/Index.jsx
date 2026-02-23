import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { router, usePage } from "@inertiajs/react";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import { PhilippinePeso, Plus, Trash2, UserRoundPen } from "lucide-react";
import Create from "./Create";
import DeleteInvoiceModal from "./elements/DeleteInvoiceModal";
import Breadcrumbs from "../components/Breadcrumbs";
import UpdateInvoiceModal from "./elements/UpdateInvoiceModal";
import InvoicesTable from "./elements/InvoicesTable";

export default function Index({
    invoices,
    hospital,
    searchQuery,
    editor,
    breadcrumbs,
    processingFilter,
    processingCounts,
    hospitalFilters,
}) {
    const [search, setSearch] = useState(searchQuery || "");
    const [openCreateInvoiceModal, setOpenCreateInvoiceModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [active, setActive] = useState(processingFilter);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [error, setError] = useState("");
    const { permissions } = usePage().props;
    const debouncedSearch = useDebounce(search, 300);

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

    const statItems = [
        { label: "All Total", key: "All" },
        { label: "Current Total", key: "Current" },
        { label: "30 days Total", key: "30 days" },
        { label: "31-60 days Total", key: "31-60 days" },
        { label: "61-90 days Total", key: "61-90 days" },
        { label: "91 over Total", key: "91 over" }
    ]

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between pb-4">
                    <Breadcrumbs items={breadcrumbs} />
                    <SearchIt search={search} setSearch={setSearch} />
                </div>

                <div className="flex justify-evenly mb-6">
                    {statItems.map(({ label, key }) => (
                        <div className="stats shadow bg-white">
                            <div className="stat">
                                <div className="stat-title">{label}</div>
                                <div className="stat-value flex gap-2 items-center justify-center">
                                    <PhilippinePeso />
                                    {Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }).format(processingCounts[key].total_amount || 0)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4">
                        <div className="tabs tabs-box w-full lg:w-auto">
                            {Object.entries(processingCounts).map(([label, data]) => (
                                <button
                                    key={label}
                                    type="button"
                                    className={`px-4 border-b-0 rounded-2xl text-black tab gap-2 ${
                                        active === label
                                            ? "tab-active font-semibold"
                                            : "hover:bg-white hover:text-black"
                                    }`}
                                    onClick={() => handleTabClick(label)}
                                >
                                    {label}
                                    <div className="badge badge-sm bg-blue-200 border-none">{data.count}</div>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                            {permissions.canUpdateInvoices && (
                                <button
                                    className="btn btn-outline border border-gray-300 rounded-xl"
                                    onClick={() => setOpenUpdateModal(true)}
                                    disabled={!isSelectMode}
                                >
                                    <UserRoundPen size={18} className="cursor-pointer" />
                                    <span>Update</span>
                                </button>
                            )}
                            {permissions.canManageInvoices && (
                                <>
                                    <button className="btn btn-primary rounded-xl" onClick={() => setOpenCreateInvoiceModal(true)}>
                                        <Plus size={16} />
                                        Add Invoice
                                    </button>
                                    <button className="btn btn-outline border border-gray-300 rounded-xl" onClick={() => setOpenDeleteModal(true)}>
                                        <Trash2 size={18} className="cursor-pointer" />
                                        <span>Delete</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <InvoicesTable
                        isSelectMode={isSelectMode}
                        setIsSelectMode={setIsSelectMode}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        invoices={invoices}
                        setShowToast={setShowToast}
                        setSuccessMessage={setSuccessMessage}
                        active={active}
                    />

                    <Pagination data={invoices} />

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

                    {showToast && (
                        <div className="toast toast-top toast-center">
                            <div className="alert alert-info">
                                <span>{successMessage}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Master>
    );
}
