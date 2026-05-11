import { CheckSquare, Square } from "lucide-react";

export default function SelectAllButton({ total, selected, onToggle }) {
    const allSelected = total > 0 && selected === total;

    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 text-xs text-base-content/60 hover:text-base-content transition-colors cursor-pointer"
        >
            {allSelected ? (
                <CheckSquare size={13} className="text-primary" />
            ) : (
                <Square size={13} />
            )}

            <span>{allSelected ? "Deselect all" : "Select all"}</span>
        </button>
    );
}
