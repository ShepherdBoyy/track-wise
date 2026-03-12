import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function Pagination({ data, creditTerm, creditLimit }) {
    const handlePerPageChange = (perPage) => {
        const searchParams = new URLSearchParams(window.location.search);

        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(searchParams),
                per_page: perPage,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const currentPerPage =
        new URLSearchParams(window.location.search).get("per_page") || 10;

    const prevLink = data.links.find((l) => l.label.toLowerCase().includes("previous"));
    const nextLink = data.links.find((l) => l.label.toLowerCase().includes("next"));
    const pageLinks = data.links.filter((l) =>
            !l.label.toLowerCase().includes("previous") &&
            !l.label.toLowerCase().includes("next")
    );
    const currentPage = pageLinks.find((l) => l.active)?.label ?? "—";
    const totalPages = pageLinks.filter((l) => l.url || l.active).length;

    const navigate = (url) => {
        if (!url) return;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <div className="flex items-center gap-2 order-2 sm:order-1">
                <span className="text-sm hidden xs:inline sm:hidden md:inline">
                    Rows per page:
                </span>
                <span className="text-sm xs:hidden sm:inline md:hidden">
                    Rows:
                </span>
                <span className="text-sm hidden">Rows per page:</span>
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

            {(creditTerm || creditLimit) && (
                <div className="hidden sm:flex items-center gap-3 order-3 sm:order-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs uppercase tracking-tight text-gray-500">Credit Term</span>
                        <span className="text-sm font-bold  bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">{creditTerm}</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs uppercase tracking-tight text-gray-500">Credit Limit</span>
                        <span className="text-sm font-bold  bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                            ₱ {Intl.NumberFormat("en-PH").format(creditLimit)}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                    disabled={!prevLink?.url}
                    onClick={() => navigate(prevLink?.url)}
                    className={`btn btn-sm rounded-xl flex items-center justify-center
                        ${!prevLink?.url ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="hidden sm:flex gap-1">
                    {pageLinks.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url && !link.active}
                            onClick={() => navigate(link.url)}
                            className={`btn btn-sm rounded-xl min-w-[2rem]
                                ${link.active ? "bg-neutral-800 text-white" : ""}
                                ${!link.url && !link.active ? "opacity-50 cursor-not-allowed" : ""}
                            `}
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </button>
                    ))}
                </div>

                <div className="flex sm:hidden items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg select-none">
                    {currentPage}
                    {totalPages > 0 && (
                        <span className="text-gray-400 ml-1">/ {totalPages}</span>
                    )}
                </div>

                <button
                    disabled={!nextLink?.url}
                    onClick={() => navigate(nextLink?.url)}
                    className={`btn btn-sm rounded-xl flex items-center justify-center
                        ${!nextLink?.url ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}