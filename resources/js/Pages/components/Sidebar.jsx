import { Link } from "@inertiajs/react";
import {
    FolderUp,
    Hospital,
    PackageSearch,
    ArrowRightLeft,
    CircleUserRound
} from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function Sidebar() {
    const { url } = usePage();

    const navItems = [
        {
            id: "hospitals",
            label: "Hospital",
            href: "/hospitals",
            icon: Hospital,
        },
        {
            id: "invoices",
            label: "Invoices",
            href: "/invoices",
            icon: PackageSearch,
        },
        {
            id: "reports",
            label: "Reports",
            href: "/reports",
            icon: FolderUp,
        },
        {
            id: "user-management",
            label: "User Management",
            href: "/user-management",
            icon: CircleUserRound ,
        },
    ];
    return (
        <div className="drawer-side is-drawer-close:overflow-visible ">
            <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            <div className="flex min-h-full flex-col items-start is-drawer-close:w-14 is-drawer-open:w-64 border-r border-base-content/5 bg-base-100">
                <ul className="menu w-full grow gap-y-2">
                    <label
                        htmlFor="my-drawer-4"
                        className="btn btn-square btn-ghost"
                    >
                        <ArrowRightLeft className="size-3" />
                    </label>

                    {navItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    className={`is-drawer-close:tooltip is-drawer-close: is-drawer-close:tooltip-right rounded-lg transition-colors duration-300 ease-in-out 
                                        ${
                                            isActive
                                                ? "bg-linear-to-br from-primary/40 to-primary/20 text-black"
                                                : "hover:bg-gray-100 hover:text-gray-900 text-gray-400"
                                        }`}
                                    data-tip={item.label}
                                >
                                    <Icon className="my-1.5 inline-block size-4" />
                                    <span className="is-drawer-close:hidden">
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
