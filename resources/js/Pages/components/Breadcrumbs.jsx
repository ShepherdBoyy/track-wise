import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="breadcrumbs flex items-center gap-3">
            {items.length > 1 && (
                <div className="tooltip tooltip-right hover:bg-gray-200 rounded-xl" data-tip="Back">
                    <Link href={items[0].url} ><ArrowLeft /></Link>
                </div>
            )}
            <ul>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index}>
                            {isLast || !item.url ? (
                                <span className="text-2xl no-underline cursor-default">{item.label}</span>
                            ) : (
                                <Link href={item.url} className="text-2xl text-gray-600">{item.label}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}