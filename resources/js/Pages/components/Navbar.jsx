import { Link } from "@inertiajs/react";
import { ArrowRightLeft } from "lucide-react";

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 ">
            <div className="flex-1"></div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar mr-3"
                    >
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li>
                            <a>Settings</a>
                        </li>
                        <Link className="cursor-pointer" href="/logout" method="post">
                            Logout
                        </Link>
                    </ul>
                </div>
            </div>
        </div>
    );
}
