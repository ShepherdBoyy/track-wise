import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ setOpenCreateModal, setShowToast, setSuccessMessage, areas, permissionList }) {
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const MUTUALLY_EXCLUSIVE_PERMISSIONS = [1, 2]; // ids of the hospitals permission

    const handlePermissionChange = (permissionId) => {
        if (MUTUALLY_EXCLUSIVE_PERMISSIONS.includes(permissionId)) {
            setSelectedPermissions(prev => {
                if (prev.includes(permissionId)) {
                    return prev.filter(id => id !== permissionId);
                } else {
                    return [...prev.filter(id => !MUTUALLY_EXCLUSIVE_PERMISSIONS.includes(id)), permissionId];
                }
            });
        } else {
            setSelectedPermissions(prev =>
                prev.includes(permissionId)
                    ? prev.filter(id => id !== permissionId)
                    : [...prev, permissionId]
            );
        }
    };

    const handleAreaChange = (areaId) => {
        setSelectedAreas((prev) => {
            if (prev.includes(areaId)) {
                return prev.filter((id) => id !== areaId);
            } else {
                return [...prev, areaId];
            }
        });
    };

    const hasAreaRestriction = selectedPermissions.some((permissionId) => {
        const permission = Object.values(permissionList).flat()
            .find((p) => p.id === permissionId);
        return permission.name === "view_area_hospitals";
    });

    return (
        <dialog open className="modal">
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-lg text-center">Add User</h3>

                <Form
                    className="flex flex-col gap-2"
                    action="/user-management/store"
                    method="post"
                    onError={(error) => setError(error)}
                    onSuccess={() => {
                        setOpenCreateModal(false);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                        setSuccessMessage(`${username} added successfully`);
                    }}
                >
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="name" className="text-sm">Name:</label>
                            {error.name && (
                                <span className="text-red-500 text-sm">
                                    {error.name}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="username" className="text-sm">Username:</label>
                            {error.username && (
                                <span className="text-red-500 text-sm">
                                    {error.username}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="username"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="password" className="text-sm">Password:</label>
                            {error.password && (
                                <span className="text-red-500 text-sm">
                                    {error.password}
                                </span>
                            )}
                        </div>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input w-full"
                            name="password"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="permissions" className="text-sm">Permissions:</label>
                            {error.permissions && (
                                <span className="text-red-500 text-sm">
                                    {error.permissions}
                                </span>
                            )}
                        </div>
                        <div className="rounded-lg max-h-74 px-4">
                            <div className="grid grid-cols-2 grid-rows-2 gap-6">
                                {Object.entries(permissionList).map(([category, permissions]) => (
                                    <div key={category}>
                                        <h4 className="capitalize mb-2 text-sm">{category.replace("_", " ")}</h4>
                                        <div className="space-y-2">
                                            {permissions.map((permission) => (
                                                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-base-200">
                                                        <input
                                                            type="checkbox"
                                                            className="toggle toggle-xs"
                                                            onChange={() => handlePermissionChange(permission.id)}
                                                            checked={selectedPermissions.includes(permission.id)}
                                                        />
                                                        {selectedPermissions.includes(permission.id) && (
                                                            <input
                                                                type="hidden"
                                                                name="permissions[]"
                                                                value={permission.id}
                                                            />
                                                        )}
                                                        <span className="text-sm">{permission.display_name}</span>
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {hasAreaRestriction && (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                                <label htmlFor="areas" className="text-sm">Assigned Areas:</label>
                                {error.areas && (
                                    <span className="text-red-500 text-sm">
                                        {error.areas}
                                    </span>
                                )}
                            </div>
                            <div className="rounded-lg px-4 max-h-96 overflow-y-auto">
                                <div className="grid grid-cols-3">
                                    {areas.map((area) => (
                                        <label key={area.id} className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-xs"
                                                checked={selectedAreas.includes(area.id)}
                                                onChange={() => handleAreaChange(area.id)}
                                            />
                                            {selectedAreas.includes(area.id) && (
                                                <input type="hidden" name="areas[]" value={area.id} />
                                            )}
                                            <span className="text-sm">{area.area_name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end mt-6 gap-2">
                        <button className="btn btn-outline rounded-xl" onClick={() => setOpenCreateModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn bg-gray-800 text-white rounded-xl">
                            Confirm
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenCreateModal(false)}
            />
        </dialog>
    );
}
