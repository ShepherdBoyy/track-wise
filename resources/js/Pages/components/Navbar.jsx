import { Link, usePage } from "@inertiajs/react";
import { Menu, ChevronsUpDown, User, LogOut } from "lucide-react";

export default function Navbar() {
    const { user, userInitials } = usePage().props.auth;

    return (
        <div className="navbar bg-base-100 px-2 sm:px-4 border-b border-gray-200">
            <div className="flex-none lg:hidden">
                <label
                    htmlFor="my-drawer-4"
                    className="btn btn-square btn-ghost text-gray-400 hover:text-primary-600 hover:bg-primary-50"
                >
                    <Menu />
                </label>
            </div>

            <div className="flex-1"></div>
            
            <div className="flex-none">
                <div className="dropdown dropdown-end w-76">
                    <div
                        tabIndex={0}
                        role="button"
                        className="flex items-center justify-between p-2 cursor-pointer border border-transparent rounded-[10px] hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                    >
                        <div className="flex items-center">
                            <div className="avatar avatar-placeholder sm:mr-3">
                                <div className="bg-primary-50 border-[1.5px] border-primary-200 text-white w-11 rounded-full flex items-center justify-center shrink-0">
                                    <span className={`text-primary-600 ${userInitials.length > 2 ? "text-sm" : "text-md"}`}>
                                        {userInitials}
                                    </span>
                                </div>
                            </div>

                            <div className="leading-tight">
                                <div className="text-md font-medium text-primary-800">
                                    {user.name}
                                </div>
                                <div className="text-sm text-primary-200">
                                    {user.username}
                                </div>
                            </div>
                        </div>

                        <ChevronsUpDown
                            size={20}
                            strokeWidth={1.5}
                            className="text-primary-300 shrink-0"
                        />
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-2 w-52 p-2 shadow space-y-1"
                    >
                        <li>
                            <Link
                                href="/profile"
                                className="text-sm text-primary-800 hover:bg-primary-50 hover:text-primary-400 transition-colors duration-200"
                            >
                                <User size={16} className="shrink-0 mr-1" />
                                Profile
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/logout"
                                method="post"
                                className="text-sm text-primary-800 hover:bg-primary-50 hover:text-primary-400 transition-colors duration-200"
                            >
                                <LogOut size={16} strokeWidth={1.5} className="shrink-0 mr-1" />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}