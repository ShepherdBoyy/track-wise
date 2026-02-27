import { Link, usePage } from "@inertiajs/react";
import {
    FolderUp,
    Hospital,
    ArrowRightLeft,
    CircleUserRound,
    TrendingUp,
    House,
    // House
} from "lucide-react";

export default function Sidebar() {
    const { url, props } = usePage();

    const navItems = [
        {
            id: "home",
            label: "Home",
            href: "/",
            icon: House,
            canView: true,
        },
        {
            id: "updates",
            label: "Updates",
            href: "/updates",
            icon: TrendingUp,
            canView: true,
        },
        {
            id: "hospitals",
            label: "Hospital",
            href: "/hospitals",
            icon: Hospital,
            canView: props.permissions.canAccessHospitals
        },
        {
            id: "import-data",
            label: "Import Data",
            href: "/import-data",
            icon: FolderUp,
            canView: props.permissions.canViewImportData
        },
        {
            id: "user-management",
            label: "User Management",
            href: "/user-management",
            icon: CircleUserRound,
            canView: props.permissions.canViewUsers
        }
    ];

    const visibleNavItems = navItems.filter((item) => item.canView);

    return (
        <div className="drawer-side z-40 overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start is-drawer-close:w-14 is-drawer-open:w-74 w-74 lg:w-auto border-r border-base-content/5 bg-base-100">
                <ul className="menu w-full grow gap-y-2">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-lg is-drawer-close:hidden ml-3">Track Wise</span>
                        <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost">
                            <ArrowRightLeft size={12} />
                        </label>
                    </div>

                    {visibleNavItems.length > 0 ? (
                        visibleNavItems.map((item) => {
                            const isActive = item.href === "/" ? url === "/" : url.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className={`rounded-lg transition-colors duration-300 ease-in-out
                                            is-drawer-close:tooltip
                                            is-drawer-close:tooltip-right
                                            ${isActive
                                                ? "bg-linear-to-br from-primary/40 to-primary/20 text-black"
                                                : "hover:bg-gray-100 hover:text-gray-900 text-gray-400"
                                            }`}
                                        data-tip={item.label}
                                    >
                                        <Icon className="my-1.5 inline-block size-4" />
                                        <span className="is-drawer-close:hidden">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })
                    ) : (
                        <li className="text-center text-gray-400 py-4">No pages available</li>
                    )}
                </ul>
            </div>
        </div>
    );
}