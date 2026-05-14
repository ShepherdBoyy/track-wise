import { useMemo } from "react";
import useDebounce from "../../hooks/useDebounce"

export default function SearchableCheckboxList({
    items,
    selected,
    onChange,
    search,
    emptyMessage,
    columns
}) {
    const debouncedSearch = useDebounce(search, 300);
    const filtered = useMemo(() => {
        if (!debouncedSearch.trim()) return items;
        return items.filter((item) =>
            item.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
        );
    }, [items, debouncedSearch]);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className={columns > 1 
                ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-1 max-h-60 overflow-y-auto`
                : "flex flex-col gap-1 max-h-60 overflow-y-auto"
            }>
              {filtered.length === 0 ? (
                  <p className="text-xs text-base-content/40 text-center py-5">No results "{search}"</p>
              ) : (
                  filtered.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                      >
                          <input
                              type="checkbox"
                              className="checkbox checkbox-sm checkbox-primary shrink-0"
                              checked={selected.includes(item.value)}
                              onChange={() =>
                                onChange(selected.includes(item.value)
                                  ? selected.filter((v) => v !== item.value)
                                  : [...selected, item.value],
                                )
                              }
                          />
                          <span className="text-sm break-words leading-snug">{item.label}</span>
                      </label>
                  ))
              )}
            </div>

            {selected.length > 0 && (
                <p className="text-xs text-base-content/50 px-1 text-right">
                    {selected.length} of {items.length} selected
                </p>
            )}
        </div>
    );
}
