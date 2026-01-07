import { Link } from "@inertiajs/react";

export default function Breadcrumbs({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="breadcrumbs">
            <ul>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={index}>
                            {isLast || !item.url ? (
                                <span className="text-2xl no-underline cursor-default text-gray-500">{item.label}</span>
                            ) : (
                                <Link href={item.url} className="text-2xl">{item.label}</Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
