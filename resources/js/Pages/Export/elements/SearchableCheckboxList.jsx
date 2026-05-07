import { useMemo, useState } from "react";
import SearchIt from "../../components/SearchIt";

export default function SearchableCheckboxList({
    items,
    selected,
    onChange,
    placeholder,
    emptyMessage,
    showSearch
}) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search.trim()) return items;
        return items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase()),
        );
    }, [items, search]);

    return (
        <div className="flex flex-col gap-2">
            {showSearch && (
              <SearchIt search={search} setSearch={setSearch} />
            )}

            <div className="grid grid-cols-3 gap-0.5 max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                  <p className="text-xs text-base-content/40 text-center py-5">No results &ldquo;{search}&rdquo;</p>
              ) : (
                  filtered.map((item) => (
                      <label
                        key={item.value}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                      >
                          <input
                              type="checkbox"
                              className="checkbox checkbox-sm checkbox-primary"
                              checked={selected.includes(item.value)}
                              onChange={() =>
                                onChange(selected.includes(item.value)
                                  ? selected.filter((v) => v !== item.value)
                                  : [...selected, item.value],
                                )
                              }
                          />
                          <span className="text-sm">{item.label}</span>
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
