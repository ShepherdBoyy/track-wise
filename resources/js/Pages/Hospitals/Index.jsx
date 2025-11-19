import { router } from "@inertiajs/react";
import Master from "../components/Master";
import { Eye, SquarePen, Plus } from "lucide-react";
import { useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "./elements/Pagination";

export default function Index({ hospitals }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [hospital, setHospital] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    return (
        <Master>
            <div className="p-8 bg-base-200 min-h-screen">
                <div className="p-6 bg-white rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">All Hospitals</span>
                        <button
                            className="btn bg-gray-800 text-white rounded-xl"
                            onClick={() => setOpenCreateModal(true)}
                        >
                            <Plus size={18} />
                            Add Hospital
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Hospital Name</th>
                                    <th>Number of Invoices</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospitals.data.map((hospital, index) => (
                                    <tr
                                        key={hospital.id}
                                        className="hover:bg-base-300"
                                    >
                                        <td>{index + 1}</td>
                                        <td>{hospital.hospital_name}</td>
                                        <td>{hospital.invoices_count}</td>
                                        <td className="flex gap-3 justify-end">
                                            <Eye
                                                onClick={() =>
                                                    router.get(`/invoices`, {
                                                        hospital_id:
                                                            hospital.id,
                                                        processing_days:
                                                            "30 days",
                                                        invoices_count:
                                                            hospital.invoices_count,
                                                    })
                                                }
                                                className="cursor-pointer"
                                            />
                                            <SquarePen
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    setOpenEditModal(true);
                                                    setHospital(hospital);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination hospitals={hospitals} />

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
