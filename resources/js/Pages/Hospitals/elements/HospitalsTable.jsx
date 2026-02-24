import { router, usePage } from "@inertiajs/react";
import SortIcon from "../../components/SortIcon";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import Edit from "../Edit";
import DeleteHospitalModal from "./DeleteHospitalModal";
import { useState } from "react";


export default function HospitalsTable({
    sortBy, 
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    hospitals,
    setShowToast,
    setSuccessMessage,
    userAreas,
    selectedArea
}) {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [hospital, setHospital] = useState("");
    const { permissions } = usePage().props;

    const handleSort = (column) => {
        let newSortOrder = "asc";

        if (sortBy === column) {
            newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        }

        setSortBy(column);
        setSortOrder(newSortOrder);

        const params = {
            hospital_search: filters.search || undefined,
            sort_by: column,
            sort_order: newSortOrder,
            selected_area: selectedArea || undefined,
            per_page: filters.per_page || undefined,
        };

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );

        router.get("/hospitals", cleanParams, {
            preserveScroll: true,
            preserveState: true
        });
    };

    return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
        <table className="table w-full">
            <thead>
                <tr>
                    <th className="w-[50px]">#</th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("area_name")}>
                        <div className="flex items-center gap-2">
                            Area
                            <SortIcon column="area_name" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("hospital_number")}>
                        <div className="flex items-center gap-2">
                            Hospital No.
                            <SortIcon column="hospital_number" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("hospital_name")}>
                        <div className="flex items-center gap-2">
                            Hospital Name
                            <SortIcon column="hospital_name" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("invoices_count")}>
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col items-center">
                                <span>Number of Invoices</span>
                            </div>
                            <SortIcon column="invoices_count" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className="cursor-pointer hover:bg-base-200" onClick={() => handleSort("invoices_sum_amount")}>
                        <div className="flex items-center gap-2">
                            Total Amount of Invoices
                            <SortIcon column="invoices_sum_amount" sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    {permissions.canManageHospitals && (
                        <th className="text-right">Action</th>
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
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        onClick={() => router.get(`/hospitals/${hospital.id}/invoices`,
                            {
                                hospital_search: filters.search || undefined,
                                per_page: filters.per_page || undefined,
                                sort_by: filters.sort_by || undefined,
                                sort_order: filters.sort_order || undefined,
                                selected_area: filters.area || undefined,
                            },
                            { 
                                preserveState: true,
                                preserveScroll: true,
                            }
                        )}
                    >
                        <td>{(hospitals.current_page - 1) * hospitals.per_page + index + 1}</td>
                        <td>{hospital.area.area_name}</td>
                        <td>{hospital.hospital_number}</td>
                        <td>{hospital.hospital_name}</td>
                        <td>{hospital.invoices_count}</td>
                        <td>₱{parseFloat(hospital.invoices_sum_amount).toLocaleString("en-PH", {minimumFractionDigits: 0, maximumFractionDigits: 2})}</td>
                        {permissions.canManageHospitals && (
                            <td>
                                <div className="flex gap-3 items-center justify-end">
                                    <div className="tooltip" data-tip="Edit" >
                                        <Pencil
                                            size={18}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenEditModal(true);
                                                setHospital(hospital);
                                            }}
                                        />
                                    </div>
                                    <div className="tooltip" data-tip="Delete">
                                        <Trash2
                                            size={18}
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDeleteModal(true);
                                                setHospital(hospital);
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
    </div>
  )
}