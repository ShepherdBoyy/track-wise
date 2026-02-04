import { Search } from "lucide-react";

export default function SearchIt({ search, setSearch }) {
    return (
        <label className="input flex items-center w-sm gap-2 rounded-xl">
            <input
                type="search"
                className=""
                required
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="flex items-center cursor-pointer ">
                <Search size="16" />
            </button>
        </label>
    );
}
