import { router, usePage } from "@inertiajs/react";
import Master from "../components/Master";
import { CirclePlus, ListFilter, PhilippinePeso } from "lucide-react";
import { useEffect, useState } from "react";
import Create from "./Create";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import useDebounce from "../hooks/useDebounce";
import Breadcrumbs from "../components/Breadcrumbs";
import Filters from "./elements/Filters";
import HospitalsTable from "./elements/HospitalsTable";
import Totals from "./elements/Totals";

export default function Index({ hospitals, userAreas, filters, breadcrumbs, processingDaysTotals }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState(filters.search || "");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "asc");
    const [selectedArea, setSelectedArea] = useState(filters.area || "");
    const [showFilters, setShowFilters] = useState(false);
    const { permissions } = usePage().props;
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const params = {
            hospital_search: debouncedSearch.trim(),
            sort_by: sortBy || undefined,
            sort_order: sortOrder || undefined,
            selected_area: selectedArea || undefined,
            per_page: filters.per_page || undefined,
            page: debouncedSearch.trim() !== (filters.search || "") ? 1 : filters.page || undefined,
        };

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );

        router.get("/hospitals", cleanParams, {
            preserveScroll: true,
            preserveState: true,
            replace: true
        })
    }, [debouncedSearch, sortBy, sortOrder]);

    const statItems = [
        { label: "Current", key: "current", style: "bg-emerald-100" },
        { label: "1-30 days", key: "thirty_days", style: "bg-sky-100" },
        { label: "31-60 days", key: "sixty_days", style: "bg-amber-100" },
        { label: "61-90 days", key: "ninety_days", style: "bg-orange-200" },
        { label: "91 over", key: "over_ninety", style: "bg-rose-300" },
        { label: "Grand Total", key: "total", style: "bg-slate-100" },
    ]

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                    <Breadcrumbs items={breadcrumbs} />
                    <div className="flex justify-content-end gap-2 w-full sm:w-auto">
                        <SearchIt search={search} setSearch={setSearch} />
                        <button className="btn btn-outline border border-gray-300 rounded-xl" onClick={() => setShowFilters(!showFilters)}>
                            <ListFilter size={16} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="flex justify-evenly gap-4 mb-6">
                    {statItems.map(({ label, key, style }) => (
                        <div className={`stats shadow flex-1 ${style}`}>
                            <div className="stat">
                                <div className="stat-title mb-6 text-md">{label}</div>
                                <div className="stat-value flex gap-2 items-center text-xl">
                                    <PhilippinePeso />
                                    {Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }).format(processingDaysTotals.overall[key] || 0)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <span className="text-xl">List of Hospitals with their invoices</span>
                        <div className="flex gap-2">
                            {permissions.canManageHospitals && (
                                <button className="btn btn-primary rounded-xl flex w-full sm:w-auto" onClick={() => setOpenCreateModal(true)}>
                                    <CirclePlus size={18} />
                                    Add Hospital
                                </button>
                            )}
                        </div>
                    </div>

                    <HospitalsTable
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        filters={filters}
                        hospitals={hospitals}
                        setShowToast={setShowToast}
                        setSuccessMessage={setSuccessMessage}
                        userAreas={userAreas}
                        selectedArea={selectedArea}
                    />

                    <Pagination data={hospitals} />

                    {showFilters && (
                        <Filters
                            setShowFilters={setShowFilters}
                            userAreas={userAreas}
                            filters={filters}
                            selectedArea={selectedArea}
                            setSelectedArea={setSelectedArea}
                        />
                    )}

                    {openCreateModal && (
                        <Create
                            setOpenCreateModal={setOpenCreateModal}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                            areas={userAreas}
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
