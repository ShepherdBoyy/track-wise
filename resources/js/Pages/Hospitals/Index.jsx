import { router, usePage } from "@inertiajs/react";
import Master from "../components/Master";
import { CirclePlus, Trash2, Pencil, ListFilter, X } from "lucide-react";
import { useEffect, useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import useDebounce from "../hooks/useDebounce";
import DeleteHospitalModal from "./elements/DeleteHospitalModal";
import { motion } from "framer-motion";
import Breadcrumbs from "../components/Breadcrumbs";
import SortIcon from "../components/SortIcon";

export default function Index({ hospitals, userAreas, filters, breadcrumbs }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [hospital, setHospital] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(filters.sort_by || "area_name");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "asc");
    const [selectedAreas, setSelectedAreas] = useState(filters.areas || []);
    const [showFilters, setShowFilters] = useState(false);
    const { permissions } = usePage().props;

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                "/hospitals",
                { search: debouncedSearch },
                { preserveState: true, preserveScroll: true },
            );
        } else {
            router.get(
                "/hospitals",
                {},
                { preserveState: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch]);

    const handleSort = (column) => {
        let newSortOrder = "asc";

        if (sortBy === column) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        setSortBy(column);
        setSortOrder(newSortOrder);

        router.get(
            "/hospitals",
            {
                sort_by: column,
                sort_order: newSortOrder,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const handleClearFilters = () => {
        setSelectedAreas([]);
        router.get(
            "/hospitals",
            {},
            { preserveScroll: true, preserveState: true }
        )
    }

    const handleApplyFilters = () => {
        router.get(
            "/hospitals",
            {
                selected_areas: selectedAreas,
            },
            { preserveState: true, preserveScroll: true }
        )
        setShowFilters(false);
    }

    const handleCheckboxChange = (areaId) => {
        setSelectedAreas((prev) => {
            if (prev.includes(areaId)) {
                return prev.filter((id) => id !== areaId);
            } else {
                return [...prev, areaId];
            }
        })
    }

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex items-center justify-between pb-4">
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
                <div className="p-6 bg-white rounded-xl shadow-lg ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl">
                            List of Hospitals with their invoices
                        </span>

                        <div className="flex gap-2">
                            {permissions.canManageHospitals && (
                                <button
                                    className="btn btn-primary rounded-xl flex"
                                    onClick={() => setOpenCreateModal(true)}
                                >
                                    <CirclePlus size={18} />
                                    Add Hospital
                                </button>
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
                                <div className="flex flex-col">
                                    <label className="label text-md">
                                        By Area
                                    </label>
                                    <div className="space-y-4 mt-4">
                                        {userAreas.map((area) => (
                                            <label 
                                                key={area.id} 
                                                className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded-lg"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-md"
                                                    checked={selectedAreas.includes(area.id)}
                                                    onChange={() => handleCheckboxChange(area.id)}
                                                />
                                                <span className="text-sm">{area.area_name}</span>
                                            </label>
                                        ))}
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
                        <table className="table table-fixed ">
                            <thead>
                                <tr>
                                    <th className="w-[50px]">#</th>
                                    <th
                                        className="w-[200px] cursor-pointer hover:bg-base-200"
                                        onClick={() => handleSort("area_name")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Area
                                            <SortIcon column="area_name" sortOrder={sortOrder} sortBy={sortBy} />
                                        </div>
                                    </th>
                                    <th
                                        className="w-[150px] cursor-pointer hover:bg-base-200"
                                        onClick={() =>
                                            handleSort("hospital_number")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Hospital No.
                                            <SortIcon column="hospital_number" sortOrder={sortOrder} sortBy={sortBy} />
                                        </div>
                                    </th>
                                    <th
                                        className="cursor-pointer hover:bg-base-200"
                                        onClick={() =>
                                            handleSort("hospital_name")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Hospital Name
                                            <SortIcon column="hospital_name" sortOrder={sortOrder} sortBy={sortBy} />
                                        </div>
                                    </th>
                                    <th
                                        className="w-[250px] cursor-pointer hover:bg-base-200"
                                        onClick={() =>
                                            handleSort("invoices_count")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Number of Invoices
                                            <SortIcon column="invoices_count" sortOrder={sortOrder} sortBy={sortBy} />
                                        </div>
                                    </th>
                                    {permissions.canManageHospitals && (
                                        <th className="w-[100px] text-right">
                                            Action
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {hospitals.data.map((hospital, index) => (
                                    <motion.tr
                                        key={hospital.id}
                                        className="hover:bg-base-300 cursor-pointer"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.05,
                                        }}
                                        onClick={() =>
                                            router.get(
                                                `/hospitals/${hospital.id}/invoices`,
                                                { processing_days: "Current" },
                                            )
                                        }
                                    >
                                        <td>
                                            {(hospitals.current_page - 1) *
                                                hospitals.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td>{hospital.area.area_name}</td>
                                        <td>{hospital.hospital_number}</td>
                                        <td>{hospital.hospital_name}</td>
                                        <td>{hospital.invoices_count}</td>
                                        {permissions.canManageHospitals && (
                                            <td>
                                                <div className="flex gap-3 items-center justify-end">
                                                    <div
                                                        className="tooltip"
                                                        data-tip="Edit"
                                                    >
                                                        <Pencil
                                                            size={18}
                                                            className="cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenEditModal(
                                                                    true,
                                                                );
                                                                setHospital(
                                                                    hospital,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                        className="tooltip"
                                                        data-tip="Delete"
                                                    >
                                                        <Trash2
                                                            size={18}
                                                            className="cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDeleteModal(
                                                                    true,
                                                                );
                                                                setHospital(
                                                                    hospital,
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination data={hospitals} />

                    {openCreateModal && (
                        <Create
                            setOpenCreateModal={setOpenCreateModal}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                            areas={userAreas}
                        />
                    )}

                    {openEditModal && (
                        <Edit
                            setOpenEditModal={setOpenEditModal}
                            hospital={hospital}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                            areas={userAreas}
                        />
                    )}

                    {openDeleteModal && (
                        <DeleteHospitalModal
                            setOpenDeleteModal={setOpenDeleteModal}
                            hospital={hospital}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
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
