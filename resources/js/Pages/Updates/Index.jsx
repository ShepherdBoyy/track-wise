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
                    <SearchIt search={search} setSearch={setSearch} />
                </div>
                <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <span className="text-xl">Recent Updates</span>
                        </div>

                        <button
                            className="btn btn-outline border font-normal border-gray-300 rounded-full"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <ListFilter size={16} />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <Filters
                            setShowFilters={setShowFilters}
                            filters={filters}
                            userAreas={userAreas}
                            users={users}
                        />
                    )}

                    <UpdatesTable
                        filters={filters}
                        latestUpdates={latestUpdates}
                    />

                    <Pagination data={latestUpdates} />
                </div>
            </div>
        </Master>
    );
}
