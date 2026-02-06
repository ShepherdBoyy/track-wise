import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Pagination({ data }) {
    const handlePerPageChange = (perPage) => {
        const searchParams = new URLSearchParams(window.location.search);
        const currentPage = parseInt(searchParams.get("page") || 1);

        router.get(
            window.location.pathname,
            { 
                ...Object.fromEntries(searchParams),
                per_page: perPage,
                page: currentPage,
            },
            { 
                preserveState: true, 
                preserveScroll: true 
            }
        );
    };

    const currentPerPage = new URLSearchParams(window.location.search).get('per_page') || 10;

    return (
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
                <span className="text-sm">Rows per page:</span>
                <div className="relative">
                    <select
                        value={currentPerPage}
                        onChange={(e) => handlePerPageChange(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1 pr-8 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <ChevronDown 
                        size={16} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                    />
                </div>
            </div>

            <div className="join flex gap-2">
                {data.links.map((link, index) => {
                    const isPrevious = link.label.toLowerCase().includes("previous");
                    const isNext = link.label.toLowerCase().includes("next");

                    return (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() =>
                                link.url &&
                                router.get(link.url,
                                    {},
                                    { preserveState: true, preserveScroll: true }
                                )
                            }
                            className={`
                                join-item btn btn-sm rounded-xl
                                ${link.active ? "bg-neutral-800 text-white" : ""}
                                ${!link.url ? "opacity-50 cursor-not-allowed": ""}
                            `}
                        >
                            {isPrevious ? (
                                <ChevronLeft size={18} />
                            ) : isNext ? (
                                <ChevronRight size={18} />
                            ) : (
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}