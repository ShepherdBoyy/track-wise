import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="breadcrumbs flex items-center gap-2 sm:gap-3 min-w-0">
            {items.length > 1 && (
                <div className="tooltip tooltip-right hover:bg-gray-200 rounded-xl flex-shrink-0" data-tip="Back">
                    <Link href={items[0].url}><ArrowLeft /></Link>
                </div>
            )}
            <ul className="flex-1 min-w-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index} className="min-w-0">
                            {isLast || !item.url ? (
                                <span className={`no-underline cursor-default truncate block ${
                                    item.label.length > 50 ? "sm:text-lg" : "text-lg sm:text-2xl"
                                }`}>
                                    {item.label === "Hospitals"
                                        ? item.label
                                        : `${item.label} (${item.code})`}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="text-lg sm:text-2xl text-gray-600 truncate block"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}