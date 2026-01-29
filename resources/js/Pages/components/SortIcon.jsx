import { ArrowDown, ArrowUp } from "lucide-react";

export default function SortIcon({ column, sortOrder, sortBy }) {
    if (sortBy !== column) {
        return null;
    }

    return sortOrder === "asc" ? (
        <ArrowUp size={16} className="mb-1" />
    ) : (
        <ArrowDown size={16} className="mb-1" />
    );
}
