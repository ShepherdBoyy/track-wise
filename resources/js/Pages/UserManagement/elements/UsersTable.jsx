import { router, usePage } from "@inertiajs/react";
import SortIcon from "../../components/SortIcon";
import ViewModal from "./ViewModal";
import Edit from "../Edit";
import DeleteUserModal from "./DeleteUserModal";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function UsersTable({ filters, users, permissionList, setShowToast, setSuccessMessage, areas, selectedIds, setSelectedIds }) {
    const [sortBy, setSortBy] = useState(filters.sort_by || null);
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState({});
    const { permissions } = usePage().props;

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

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
        <table className="table w-full">
            <thead>
                <tr>
                    <th className="w-[50px]">
                        <input
                            type="checkbox"
                            className="checkbox w-5 h-5"
                            checked={selectedIds.length === users.data.length && users.data.length > 0}
                            onChange={(e) => {
                                if (e.target.checked && users.data.length > 0) {
                                    setSelectedIds(users.data.map((i) => i.id));
                                } else {
                                    setSelectedIds([]);
                                }
                            }}
                        />
                    </th>
                    <th className="w-[100px]">#</th>
                    <th
                        className="cursor-pointer hover:bg-base-200"
                        onClick={() => handleSort("name")}
                    >
                        <div className="flex items-center gap-2">
                            Name
                            <SortIcon column={"name"} sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    <th className={`${permissions.canManageUsers ? "w-1/4" : "w-1/3"}`}>
                        <div className="flex items-center gap-2">Area</div>
                    </th>
                    <th
                        className="cursor-pointer hover:bg-base-200"
                        onClick={() => handleSort("created_at")}
                    >
                        <div className="flex items-center gap-2">
                            Created At
                            <SortIcon column={"created_at"} sortOrder={sortOrder} sortBy={sortBy} />
                        </div>
                    </th>
                    {permissions.canManageUsers && (
                        <th className="text-right">Action</th>
                    )}
                </tr>
            </thead>

            <tbody>
                {users.data.map((user, index) => {
                    const getArea = () => {
                        const canViewAllHospitals = user.permissions.some((permission) =>
                            permission.name === "view_all_hospitals",
                        );

                        if (canViewAllHospitals) {
                            return "All Areas";
                        } else if (user.areas) {
                            return user.areas.map((area) => area.area_name).join(", ");
                        } else {
                            return "No Access";
                        }
                    };

                    const area = getArea();

                    return (
                        <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            key={user.id}
                            className={selectedIds.length < 1 ? `hover:bg-base-300 cursor-pointer` : ""}
                            onClick={() => {
                                if (selectedIds.length < 1) {
                                    setOpenViewModal(true);
                                    setSelectedUser(user);
                                }
                            }}
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox w-5 h-5"
                                    checked={selectedIds.includes(user.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds([...selectedIds, user.id]);
                                        } else {
                                            const newSelected = selectedIds.filter((id) => id !== user.id);
                                            setSelectedIds(newSelected);
                                        }
                                    }}
                                />
                            </td>
                            <td>{(users.current_page - 1) * users.per_page + index + 1}</td>
                            <td>{user.name}</td>
                            <td>{area}</td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            {permissions.canManageUsers && (
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
                                            <Pencil size={18} className="cursor-pointer" />
                                        </div>
                                        <div
                                            className="tooltip"
                                            data-tip="Delete"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenDeleteModal(true);
                                                setSelectedUser(user);
                                            }}
                                        >
                                            <Trash2 size={18} className="cursor-pointer" />
                                        </div>
                                    </div>
                                </td>
                            )}
                        </motion.tr>
                    );
                })}
            </tbody>
        </table>

        {openViewModal && (
            <ViewModal
                setOpenViewModal={setOpenViewModal}
                selectedUser={selectedUser}
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
    </div>
  )
}
