import { Search } from "lucide-react";

export default function SearchIt({ search, setSearch }) {
    return (
        <div className="w-full sm:w-64 md:w-72 lg:w-80">
            <label className="input flex items-center w-full gap-2 rounded-xl">
                <Search size="16" />
                <input
                    type="search"
                    className=""
                    required
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </label>
        </div>
    );
}
