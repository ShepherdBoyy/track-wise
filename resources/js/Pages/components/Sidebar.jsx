import { FolderUp, PackageSearch } from "lucide-react";


export default function Sidebar() {
    return (
        <div className="drawer-side is-drawer-close:overflow-visible">
            <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                <ul className="menu w-full grow">
                    <li>
                        <button
                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Invoices"
                        >
                            <PackageSearch className="my-1.5 inline-block size-4" />
                            <span className="is-drawer-close:hidden">
                                Invoices
                            </span>
                        </button>
                    </li>

                    <li>
                        <button
                            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Reports"
                        >
                            <FolderUp className="my-1.5 inline-block size-4" />
                            <span className="is-drawer-close:hidden">
                                Reports
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
