import { router } from "@inertiajs/react";
import Master from "../components/Master";
import { Eye, CirclePlus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import Create from "./Create";
import Edit from "./Edit";
import Pagination from "../components/Pagination";
import Destroy from "../components/Destroy";

export default function Index({ hospitals }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [hospital, setHospital] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    return (
        <Master>
            <div className=" bg-base-200 ">
                <div className="p-6">
                    <span className="text-2xl">Hospitals</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg ">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl">
                            List of Hospitals with their invoices
                        </span>

                        <button
                            className="btn btn-primary rounded-xl flex"
                            onClick={() => setOpenCreateModal(true)}
                        >
                            <CirclePlus size={18} />
                            Add Hospital
                        </button>
                    </div>

                    <div className="rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table table-fixed ">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">#</th>
                                    <th className="w-1/3">Hospital Name</th>
                                    <th className="w-1/3">
                                        Number of Invoices
                                    </th>
                                    <th className="w-1/4 text-right">Action</th>
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
                                        <td>
                                            <div className="flex gap-3 items-center justify-end">
                                                <div
                                                    className="tooltip"
                                                    data-tip="View"
                                                >
                                                    <Eye
                                                        size={18}
                                                        onClick={() =>
                                                            router.get(
                                                                `/hospitals/invoices/${hospital.id}/all/${hospital.invoices_count}`
                                                            )
                                                        }
                                                        className="cursor-pointer"
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
                                                        onClick={() => {
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
                                    </tr>
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
                        <Destroy
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
