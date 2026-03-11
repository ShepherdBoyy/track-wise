import { Link, usePage } from "@inertiajs/react";
import { Menu, ChevronsUpDown, User, LogOut } from "lucide-react";

export default function Navbar() {
    const { user, userInitials } = usePage().props.auth;

    return (
        <div className="navbar bg-base-100 px-2 sm:px-4 border-b border-gray-200">
            <div className="flex-none lg:hidden">
                <label
                    htmlFor="my-drawer-4"
                    className="btn btn-square btn-ghost"
                >
                    <Menu />
                </label>
            </div>

            <div className="flex-1"></div>
            <div className="flex-none">
                <div className="dropdown dropdown-end w-75">
                    <div
                        tabIndex={0}
                        role="button"
                        className="flex items-center justify-between p-2 cursor-pointer"
                    >
                        <div className="flex items-center">
                            <div className="avatar avatar-placeholder sm:mr-3">
                                <div className="bg-neutral text-white w-11 rounded-full flex items-center justify-center">
                                    <span className={`${userInitials.length > 2 ? "text-sm" : "text-md"}`}>
                                        {userInitials}
                                    </span>
                                </div>
                            </div>

                            <div className="leading-tight">
                                <div className="text-md font-medium">
                                    {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {user.username}
                                </div>
                            </div>
                        </div>

                        <ChevronsUpDown
                            size={20}
                            strokeWidth={1.5}
                            className="text-gray-500"
                        />
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-2 w-52 p-2 shadow space-y-1"
                    >
                        <li>
                            <Link href="/profile" className="text-sm">
                                <User
                                    size={16}
                                    className="text-gray-500 mr-1"
                                />
                                Profile
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/logout"
                                method="post"
                                className="text-sm"
                            >
                                <LogOut
                                    size={16}
                                    strokeWidth={1.5}
                                    className="text-gray-500 mr-1"
                                />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
