import { ArrowDown, ArrowUp } from "lucide-react";

export default function SortIcon({ column, sortOrder, sortBy }) {
    if (sortBy !== column) {
        return null;
    }

    return sortOrder === "asc" ? (
        <ArrowUp size={14} className="mb-1" />
    ) : (
        <ArrowDown size={14} className="mb-1" />
    );
}
