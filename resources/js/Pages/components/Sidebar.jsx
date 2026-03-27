import { Link, usePage } from "@inertiajs/react";
import {
    FolderUp,
    Hospital,
    ArrowRightLeft,
    CircleUserRound,
    TrendingUp,
    House,
} from "lucide-react";
import { useEffect } from "react";

export default function Sidebar() {
    const { url, props } = usePage();

    const navItems = [
        {
            id: "home",
            label: "Home",
            href: "/",
            icon: House,
            canView: true,
            group: "main"
        },
        {
            id: "updates",
            label: "Updates",
            href: "/updates",
            icon: TrendingUp,
            canView: true,
            group: "main"
        },
        {
            id: "hospitals",
            label: "Hospital",
            href: "/hospitals",
            icon: Hospital,
            canView: props.permissions.canAccessHospitals,
            group: "management"
        },
        {
            id: "import-data",
            label: "Import Data",
            href: "/import-data",
            icon: FolderUp,
            canView: props.permissions.canViewImportData,
            group: "management"
        },
        {
            id: "user-management",
            label: "User Management",
            href: "/user-management",
            icon: CircleUserRound,
            canView: props.permissions.canViewUsers,
            group: "management"
        }
    ];

    const visibleNavItems = navItems.filter((item) => item.canView);
    const cleanUrl = url.split("?")[0]
    const isProfilePage = cleanUrl === "/profile";

    useEffect(() => {
        if (!isProfilePage) {
            localStorage.setItem("last-active-tab", cleanUrl);
        }
    }, [cleanUrl, isProfilePage]);

    const lastActiveTab = localStorage.getItem("last-active-tab") || "/";
    const mainItems = visibleNavItems.filter(i => i.group === "main");
    const managementItems = visibleNavItems.filter(i => i.group === "management");
    
    const isActive = (href) => isProfilePage
        ? (href === "/" ? lastActiveTab === "/" : lastActiveTab.startsWith(href))
        : (href === "/" ? cleanUrl === "/" : url.startsWith(href));
    
    const NavLink = ({ item }) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
            <li key={item.id}>
                <Link
                    href={item.href}
                    className={`
                        flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition-all duration-200
                        is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:justify-center
                        ${active
                            ? "bg-primary-100 text-primary-800 font-medium"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        }
                    `}
                    data-tip={item.label}
                >
                    <Icon className={`shrink-0 size-4 ${active ? "text-primary-500" : ""}`} />
                    <span className="is-drawer-close:hidden">{item.label}</span>
                </Link>
            </li>
        );
    }

    return (
        <div className="drawer-side z-40 overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start is-drawer-close:w-14 is-drawer-open:w-74 w-74 lg:w-auto border-r border-primary-500/10 bg-base-100">
                <ul className="menu w-full grow gap-y-2">
                    <div className="flex justify-between items-center mb-4 pb-7 border-b border-black/30 px-1 is-drawer-close:justify-center is-drawer-close:px-0">
                        <div className="flex items-center gap-2 is-drawer-close:hidden">
                            <img src="/favicon.png" alt="PMC Logo" className="w-7 h-7" />
                            <span className="text-primary-800 font-medium text-lg">Track Wise</span>
                        </div>
                        <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost text-gray-400 hover:text-gray-600">
                            <ArrowRightLeft size={12} />
                        </label>
                    </div>

                    {mainItems.map(item => <NavLink key={item.id} item={item} />)}

                    {managementItems.length > 0 && (
                        <>
                            <div className="h-px bg-gray-100 my-2" />
                            <p className="is-drawer-close:hidden text-[10px] uppercase tracking-wide text-gray-300 px-3 pb-1 pt-1">
                                Management
                            </p>
                            {managementItems.map(item => <NavLink key={item.id} item={item} />)}
                        </>
                    )}

                    {visibleNavItems.length === 0 && (
                        <li className="text-center text-gray-300 py-4 text-sm">No pages available</li>
                    )}
                </ul>
            </div>
        </div>
    );
}