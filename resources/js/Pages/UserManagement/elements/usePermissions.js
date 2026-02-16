import { useState } from "react";

// hooks/usePermissions.js
export function usePermissions(initialPermissions = []) {
    const [selectedPermissions, setSelectedPermissions] = useState(initialPermissions);

    const MUTUALLY_EXCLUSIVE_PERMISSIONS = [1, 2];

    const permissionDependencies = {
        6: [4],
        10: [9],
        8: [7],
    };

    const getAutoDependencies = (permissionIds) => {
        const auto = new Set();
        permissionIds.forEach((id) => {
            const deps = permissionDependencies[id] || [];
            deps.forEach((dep) => auto.add(dep));
        });
        return [...auto];
    };

    const isAutoChecked = (permissionId) => {
        return Object.entries(permissionDependencies).some(
            ([trigger, deps]) =>
                deps.includes(permissionId) &&
                selectedPermissions.includes(Number(trigger))
        );
    };

    const handlePermissionChange = (permissionId) => {
        if (MUTUALLY_EXCLUSIVE_PERMISSIONS.includes(permissionId)) {
            setSelectedPermissions((prev) => {
                if (prev.includes(permissionId)) {
                    return prev.filter((id) => id !== permissionId);
                } else {
                    return [
                        ...prev.filter((id) => !MUTUALLY_EXCLUSIVE_PERMISSIONS.includes(id)),
                        permissionId,
                    ];
                }
            });
        } else {
            setSelectedPermissions((prev) =>
                prev.includes(permissionId)
                    ? prev.filter((id) => id !== permissionId)
                    : [...prev, permissionId]
            );
        }
    };

    const autoCheckedPermissions = getAutoDependencies(selectedPermissions);
    const allActivePermissions = [...new Set([...selectedPermissions, ...autoCheckedPermissions])];

    return {
        selectedPermissions,
        allActivePermissions,
        isAutoChecked,
        handlePermissionChange,
    };
}