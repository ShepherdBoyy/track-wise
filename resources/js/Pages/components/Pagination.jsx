import { router } from "@inertiajs/react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronDown, ChevronsRight } from "lucide-react";
import { useRef, useState } from "react";

function NavBtn({ onClick, disabled, title, children }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 active:scale-95
                ${disabled
                    ? "opactiy-30 pointer-events-none border-gray-100 text-gray-300 bg-white"
                    : "border-primary-300 text-gray-500 bg-white cursor-pointer hover:bg-primary-500 hover:text-white hover:border-primary-500"
                }
            `}
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
        if (value === "" || /^\d+$/.test(value)) setPageInput(value);
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
                <span className="text-sm text-gray-400 hidden xs:inline sm:hidden md:inline">Rows per page</span>
                <span className="text-sm text-gray-400 xs:hidden sm:inline md:hidden">Rows</span>
                <div className="relative">
                    <select
                        value={currentPerPage}
                        onChange={(e) => handlePerPageChange(e.target.value)}
                        className="appearance-none white border border-primary-300 rounded-lg px-3 py-1 pr-7 text-sm font-medium text-gray-500 cursor-pointer hover:bg-primary-500 hover:text-white transition-colors duration-150"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 hover:text-white" />
                </div>
            </div>

            {(creditTerm || creditLimit) && (
                <div className="hidden sm:flex items-center gap-3 order-3 sm:order-2">
                    {creditTerm && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] uppercase tracking-widest text-gray-400">Credit Term</span>
                            <span className="text-sm font-semibold bg-secondary-300 border border-secondary-400 text-secondary-900 px-2.5 py-0.5 rounded-full">
                                {creditTerm}
                            </span>
                        </div>
                    )}
                    {creditTerm && creditLimit && <div className="w-px h-5 bg-gray-100" />}
                    {creditLimit && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] uppercase tracking-widest text-gray-400">Credit Limit</span>
                            <span className="text-sm font-semibold bg-secondary-300 border border-secondary-400 text-secondary-900 px-2.5 py-0.5 rounded-full">
                                ₱ {Intl.NumberFormat("en-PH").format(creditLimit)}
                            </span>
                        </div>
                    )}
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
                    className="flex items-center justify-between gap-3 h-8 px-3 rounded-lg border border-primary-500 bg-primary-500 cursor-text min-w-[100px]"
                    onClick={() => inputRef.current?.focus()}
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
                        className="w-7 text-center text-sm font-bold border-none outline-none bg-transparent text-white placeholder:text-white/60 placeholder:font-bold transition-colors"
                    />
                    <span className="text-xs text-white/50 shrink-0">of</span>
                    <span className="text-sm font-bold text-secondary-300 shrink-0">{totalPages}</span>
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