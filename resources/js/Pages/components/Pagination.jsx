import { router } from "@inertiajs/react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronsRight } from "lucide-react";
import { useRef, useState } from "react";

function NavBtn({ onClick, disabled, title, children }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border text-gray-600 bg-white transition-all duration-150 hover:bg-black hover:text-white hover:border-black active:scale-95
                ${disabled
                    ? "opacity-30 pointer-events-none border-gray-200"
                    : "border-gray-200 cursor-pointer"
                }
            `}
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        >
            {children}
        </button>
    );
}

export default function Pagination({ data, creditTerm, creditLimit }) {
    const [pageInput, setPageInput] = useState("");
    const inputRef = useRef(null);

    const currentPage = data.current_page;
    const totalPages = data.last_page;
    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;

    const currentPerPage =
        new URLSearchParams(window.location.search).get("per_page") || 10;

    const navigateToPage = (page) => {
        const clamped = Math.min(Math.max(1, page), totalPages);
        const searchParams = new URLSearchParams(window.location.search);
        router.get(
            window.location.pathname,
            { ...Object.fromEntries(searchParams), page: clamped },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage) => {
        const searchParams = new URLSearchParams(window.location.search);

        router.get(
            window.location.pathname,
            { ...Object.fromEntries(searchParams), per_page: perPage, page: 1 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            setPageInput(value);
        }
    };

    const handlePageJump = () => {
        if (!pageInput) return;
        const page = parseInt(pageInput, 10);
        if (isNaN(page)) return;
        setPageInput("");
        navigateToPage(page);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handlePageJump();
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

            <div className="flex items-center gap-1.5 order-1 sm:order-3">
                <NavBtn onClick={() => navigateToPage(1)} disabled={isFirst} title="First page">
                    <ChevronsLeft size={14} />
                </NavBtn>

                <NavBtn onClick={() => navigateToPage(currentPage - 1)} disabled={isFirst} title="Previous page">
                    <ChevronLeft size={14} />
                </NavBtn>

                <div
                    className="flex items-stretch h-8 rounded-lg overflow-hidden border border-gray-200 bg-white"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        value={pageInput}
                        onChange={handlePageInputChange}
                        onKeyDown={handleKeyDown}
                        onBlur={handlePageJump}
                        placeholder={String(currentPage)}
                        className="h-full w-11 text-center text-sm font-semibold border-none outline-none bg-transparent placeholder:text-gray-800 placeholder:font-semibold focus:bg-gray-50 transition-colors"
                    />

                    <div className="flex items-center">
                        <div className="w-px h-4 bg-gray-200" />
                    </div>

                    <button
                        onClick={() => inputRef.current?.focus()}
                        className="flex items-center gap-3 px-2.5 text-xs text-gray-400 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer font-medium"
                    >
                        of <span className="text-gray-900 font-bold">{totalPages}</span>
                    </button>
                </div>

                <NavBtn onClick={() => navigateToPage(currentPage + 1)} disabled={isLast} title="Next page">
                    <ChevronRight size={14} />
                </NavBtn>

                <NavBtn onClick={() => navigateToPage(totalPages)} disabled={isLast} title="Last page">
                    <ChevronsRight size={14} />
                </NavBtn>
            </div>
        </div>
    );
}