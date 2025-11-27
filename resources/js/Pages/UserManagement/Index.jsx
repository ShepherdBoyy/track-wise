import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import Master from "../components/Master";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import { useState } from "react";
import ViewModal from "./elements/ViewModal";
import Create from "./Create"
import Edit from "./Edit";

export default function Index({ users }) {
    const [showToast, setShowToast] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [successMesage, setSuccessMessage] = useState("");

    return (
        <Master>
            <div className="bg-base-200 ">
                <div className="p-6">
                    <span className="text-2xl">User Management</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2 ">
                        <div className="flex items-center gap-x-3">
                            <span className="text-2xl">All Users</span>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <div className="flex gap-2">
                                <button
                                    className="btn btn-primary rounded-xl flex"
                                    onClick={() => setOpenCreateModal(true)}
                                >
                                    <CirclePlus size={18} />
                                    Add Hospital
                                </button>
                            </div>
                            <div className="flex justify-content-end">
                                <SearchIt
                                    // search={search}
                                    // setSearch={setSearch}
                                    name="Invoice No."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table  table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">#</th>
                                    <th className="w-1/4">Name</th>
                                    <th className="w-1/3">Role</th>
                                    <th className="w-1/4">Created At</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-base-300 cursor-pointer"
                                        onClick={() => {
                                            setOpenViewModal(true);
                                            setSelectedUser(user);
                                        }}
                                    >
                                        <td>
                                            {(users.current_page - 1) *
                                                users.per_page +
                                                index +
                                                1}
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-3 justify-end pr-2">
                                                <div
                                                    className="tooltip"
                                                    data-tip="Edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenEditModal(true);
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <Pencil
                                                        size={18}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                                <div
                                                    className="tooltip"
                                                    data-tip="Delete"
                                                >
                                                    <Trash2
                                                        size={18}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {openViewModal && (
                        <ViewModal
                            setOpenViewModal={setOpenViewModal}
                            selectedUser={selectedUser}
                        />
                    )}

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
                            selectedUser={selectedUser}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                        />
                    )}

                    {showToast && (
                        <div className="toast toast-top toast-center">
                            <div className="alert alert-success">
                                <span>{successMesage}</span>
                            </div>
                        </div>
                    )}

                    <Pagination data={users} />
                </div>
            </div>
        </Master>
    );
}
