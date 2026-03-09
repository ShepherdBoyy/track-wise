import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import { useState } from "react";

export default function Filters({ setShowFilters, userAreas, users, filters }) {
    const [selectedArea, setSelectedArea] = useState(filters.area || "");
    const [selectedStatus, setSelectedStatus] = useState(filters.status || "");
    const [selectedUser, setSelectedUser] = useState(filters.user || "");

    console.log(filters.per_page);

    const handleClearFilters = () => {
        setSelectedArea("");
        setSelectedStatus("");
        setSelectedUser("");

        router.get(
            "/updates",
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleApplyFilters = () => {
        router.get(
            "/updates",
            {
                selected_area: selectedArea,
                selected_status: selectedStatus,
                selected_user: selectedUser,
                per_page: filters.per_page
            },
            { preserveState: true, preserveScroll: true },
        );
        setShowFilters(false);
    };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-90 bg-base-100 shadow-lg pt-6 pb-18 px-6 z-50 transition-transform duration-300">
        <div className="flex justify-between mb-6">
            <p className="text-xl">Filter Options</p>
            <X size={20} onClick={() => setShowFilters(false)} className="cursor-pointer" />
        </div>
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col justify-center gap-6">
                <div>
                    <label className="label text-md">By Area</label>
                    <select
                        className="select w-full rounded-xl"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                    >
                        <option value="">Select</option>
                        {userAreas.map((area) => (
                            <option key={area.id} value={area.id}>{area.area_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label text-md">By Status</label>
                    <select
                        className="select w-full rounded-xl"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Select</option>
                        <option value="open">Open</option>
                        <option value="overdue">Overdue</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div>
                    <label className="label text-md">By Users</label>
                    <select
                        className="select w-full rounded-xl"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">Select</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                <button className="btn btn-outline rounded-3xl flex-1" onClick={handleClearFilters}>
                    Clear All
                </button>
                <button className="btn bg-gray-800 text-white rounded-3xl flex-1" onClick={handleApplyFilters}>
                    Apply Filters
                </button>
            </div>
        </div>
    </div>
  )
}
