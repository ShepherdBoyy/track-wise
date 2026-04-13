import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import useDebounce from "../hooks/useDebounce";
import { router } from "@inertiajs/react";
import Pagination from "../components/Pagination";
import { ListFilter } from "lucide-react";
import Filters from "./elements/Filters";
import UpdatesTable from "./elements/UpdatesTable";

export default function Index({ latestUpdates, filters, userAreas, users }) {
    const [search, setSearch] = useState(filters.search || "");
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                "/updates",
                { search: debouncedSearch },
                { preserveState: true, preserveScroll: true },
            );
        } else {
            router.get(
                "/updates",
                {},
                { preserveState: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch]);

    return (
        <Master>
            <div className="bg-base-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <span className="text-2xl">Summary</span>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <SearchIt search={search} setSearch={setSearch} />
                        <button
                            className="flex items-center gap-2 px-4 py-2 rounded-[10px] border border-gray-200 bg-white text-sm text-gray-500 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all duration-150 cursor-pointer"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <ListFilter size={16} />
                            Filters
                        </button>
                    </div>
                </div>
                <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
                    <span className="text-xl mb-4 block">Recent Updates</span>
                    
                    <UpdatesTable
                        filters={filters}
                        latestUpdates={latestUpdates}
                    />

                    <Pagination data={latestUpdates} />

                    {showFilters && (
                        <Filters
                            setShowFilters={setShowFilters}
                            filters={filters}
                            userAreas={userAreas}
                            users={users}
                        />
                    )}
                </div>
            </div>
        </Master>
    );
}
