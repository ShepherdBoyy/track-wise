import { CirclePlus } from "lucide-react";
import Master from "../components/Master";
import Pagination from "../components/Pagination";
import SearchIt from "../components/SearchIt";
import { useEffect, useState } from "react";
import Create from "./Create";
import useDebounce from "../hooks/useDebounce";
import { router, usePage } from "@inertiajs/react";
import UsersTable from "./elements/UsersTable";
import ChangePasswordModal from "./elements/ChangePasswordModal";

export default function Index({ users, areas, filters, permissionList }) {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openChangePasswordModal, setChangePasswordModal] = useState(false);
    const [successMesage, setSuccessMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const { permissions } = usePage().props;

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                "/user-management",
                { search: debouncedSearch },
                { preserveState: true, preserveScroll: true },
            );
        } else {
            router.get(
                "/user-management",
                {},
                { preserveState: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch]);

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <span className="text-2xl">User Management</span>
                    <SearchIt
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
                <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2">
                        <div className="flex items-center gap-x-3">
                            <span className="text-xl">All Users</span>
                        </div>

                        <div className="flex gap-2">
                            {permissions.canManageUsers && (
                                <>
                                    <button
                                        className="btn btn-outline border border-gray-300 rounded-xl"
                                        disabled={selectedIds.length < 2}
                                        onClick={() => setChangePasswordModal(true)}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        className="btn btn-primary rounded-xl flex"
                                        onClick={() => setOpenCreateModal(true)}
                                    >
                                        <CirclePlus size={18} />
                                        Add User
                                    </button>
                                </>
                            )}
                        </div>
                    </div>  

                    <UsersTable
                        filters={filters}
                        users={users}
                        permissionList={permissionList}
                        setSuccessMessage={setSuccessMessage}
                        setShowToast={setShowToast}
                        areas={areas}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                    />

                    <Pagination data={users} />

                    {openCreateModal && (
                        <Create
                            setOpenCreateModal={setOpenCreateModal}
                            setShowToast={setShowToast}
                            setSuccessMessage={setSuccessMessage}
                            areas={areas}
                            permissionList={permissionList}
                        />
                    )}

                    {openChangePasswordModal && (
                        <ChangePasswordModal 
                            setChangePasswordModal={setChangePasswordModal}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
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
                </div>
            </div>
        </Master>
    );
}
