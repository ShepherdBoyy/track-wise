import { Link } from "@inertiajs/react";

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="breadcrumbs items-center">
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
