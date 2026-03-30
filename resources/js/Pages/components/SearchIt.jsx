import { Search, ArrowRight } from "lucide-react";

export default function SearchIt({ search, setSearch, placeholder = "Search…" }) {
    return (
        <div className="flex items-center bg-white border-[1.5px] border-primary-200 rounded-xl overflow-hidden w-sm transition-all duration-200 focus-within:border-primary-500">
            <div className="flex items-center justify-center w-10 h-10 shrink-0">
                <Search
                    size={15}
                    className="text-primary-200 transition-colors duration-200 group-focus-within:text-primary-500"
                />
            </div>

            <input
                type="search"
                className="flex-1 h-10 bg-transparent border-none outline-none text-[13.5px] text-primary-800 placeholder:text-primary-200 pr-1"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}