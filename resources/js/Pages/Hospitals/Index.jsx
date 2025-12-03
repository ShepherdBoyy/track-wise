import { router } from "@inertiajs/react";
import Master from "../components/Master";
import { CirclePlus, Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import useDebounce from "../hooks/useDebounce";
import DeleteHospitalModal from "./elements/DeleteHospitalModal";
import { motion } from "framer-motion";

export default function Index({ hospitals }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [hospital, setHospital] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                "/hospitals",
                { search: debouncedSearch },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch]);

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex items-center justify-between pb-4">
                    <span className="text-2xl">Hospitals</span>
                    <div className="flex justify-content-end">
                        <SearchIt
                            search={search}
                            setSearch={setSearch}
                            name="Hospital"
                        />
                    </div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl">
                            List of Hospitals with their invoices
                        </span>

                        <div className="flex gap-2">
                            <button
                                className="btn btn-primary rounded-xl flex"
                                onClick={() => setOpenCreateModal(true)}
                            >
                                <CirclePlus size={18} />
                                Add Hospital
                            </button>
                        </div>
                    </div>

                    <div className="rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table table-fixed ">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">#</th>
                                    <th className="w-1/3">Hospital No.</th>
                                    <th className="w-3/4">Hospital Name</th>
                                    <th className="w-1/3">
                                        Number of Invoices
                                    </th>
                                    <th className="w-1/4 text-right">Action</th>
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
                                                `/hospitals/${hospital.id}/invoices/Current`
                                            )
                                        }
                                    >
                                        <td>{index + 1}</td>
                                        <td>{hospital.hospital_number}</td>
                                        <td>{hospital.hospital_name}</td>
                                        <td>{hospital.invoices_count}</td>
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
                                                            e.stopPropagation()
                                                            setOpenEditModal(
                                                                true
                                                            );
                                                            setHospital(
                                                                hospital
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
                                                            e.stopPropagation()
                                                            setOpenDeleteModal(
                                                                true
                                                            );
                                                            setHospital(
                                                                hospital
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
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
                        />
                    )}

                    {openEditModal && (
                        <Edit
                            setOpenEditModal={setOpenEditModal}
                            hospital={hospital}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
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
                            <div className="alert alert-success">
                                <span>{successMessage}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Master>
    );
}
