import { ArrowDown, ArrowUp, CirclePlus, Pencil, Trash2 } from "lucide-react";
import Master from "../components/Master";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import { useEffect, useState } from "react";
import ViewModal from "./elements/ViewModal";
import Create from "./Create";
import Edit from "./Edit";
import DeleteUserModal from "./elements/DeleteUserModal";
import useDebounce from "../hooks/useDebounce";
import { motion } from "framer-motion";
import { router, usePage } from "@inertiajs/react";

export default function Index({ users, areas, filters, permissionList }) {
    const [showToast, setShowToast] = useState(false);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const [successMesage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState(filters.sort_by || null);
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
    const { permissions } = usePage().props;

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                "/user-management",
                { search: debouncedSearch },
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
            "/user-management",
            {
                sort_by: column,
                sort_order: newSortOrder,
            },
            { preserveScroll: true, preserveState: true },
        );
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) {
            return null;
        }
        return sortOrder === "asc" ? (
            <ArrowUp size={16} className="mb-1" />
        ) : (
            <ArrowDown size={16} className="mb-1" />
        );
    };

    return (
        <Master>
            <div className="bg-base-200 ">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl">User Management</span>
                    <SearchIt
                        search={search}
                        setSearch={setSearch}
                        name="User"
                    />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div className="flex items-center gap-x-3">
                            <span className="text-2xl">All Users</span>
                        </div>

                        <div className="flex gap-2">
                            {permissions.canManageUsers && (
                                <button
                                    className="btn btn-primary rounded-xl flex"
                                    onClick={() => setOpenCreateModal(true)}
                                >
                                    <CirclePlus size={18} />
                                    Add User
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table  table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">#</th>
                                    <th
                                        className={`${permissions.canManageUsers ? "1/4" : "1/3"} cursor-pointer hover:bg-base-200`}
                                        onClick={() => {
                                            handleSort("name");
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Name
                                            <SortIcon column={"name"} />
                                        </div>
                                    </th>
                                    <th className={`${permissions.canManageUsers ? "1/4" : "1/3"}`}>
                                        <div className="flex items-center gap-2">
                                            Area
                                        </div>
                                    </th>
                                    <th
                                        className={`${permissions.canManageUsers ? "1/4" : "1/3"} cursor-pointer hover:bg-base-200`}
                                        onClick={() => {
                                            handleSort("created_at");
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            Created At
                                            <SortIcon column={"created_at"} />
                                        </div>
                                    </th>
                                    {permissions.canManageUsers && (
                                        <th className="w-[100px] text-right">Action</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.map((user, index) => {
                                    const getArea = () => {
                                        const canViewAllHospitals = user.permissions.some(
                                            (permission) => permission.name === "view_all_hospitals"
                                        );

                                        if (canViewAllHospitals) {
                                            return "All Areas";
                                        } else if (user.areas) {
                                            return user.areas.map((area) => area.area_name).join(", ");
                                        } else {
                                            return "No Access";
                                        }
                                    }

                                    const area = getArea();

                                    return (
                                        <motion.tr
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: index * 0.05,
                                            }}
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
                                            <td>{area}</td>
                                            <td>
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            {permissions.canManageUsers && (
                                                <td>
                                                    <div className="flex gap-3 justify-end pr-2">
                                                        <div
                                                            className="tooltip"
                                                            data-tip="Edit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenEditModal(
                                                                    true,
                                                                );
                                                                setSelectedUser(
                                                                    user,
                                                                );
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
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDeleteModal(
                                                                    true,
                                                                );
                                                                setSelectedUser(
                                                                    user,
                                                                );
                                                            }}
                                                        >
                                                            <Trash2
                                                                size={18}
                                                                className="cursor-pointer"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    );
                                })}
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
                            areas={areas}
                            permissionList={permissionList}
                        />
                    )}

                    {openEditModal && (
                        <Edit
                            setOpenEditModal={setOpenEditModal}
                            selectedUser={selectedUser}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                            areas={areas}
                            permissionList={permissionList}
                        />
                    )}

                    {openDeleteModal && (
                        <DeleteUserModal
                            setOpenDeleteModal={setOpenDeleteModal}
                            selectedUser={selectedUser}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                        />
                    )}

                    {showToast && (
                        <div className="toast toast-top toast-center">
                            <div className="alert alert-info">
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
