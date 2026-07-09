import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import { useState } from "react";

const AMOUNT_STEPS = [null, 0, 250000, 500000, 750000, 1000000];
const AMOUNT_LABELS = ["<₱0", "₱0", "₱250K", "₱500K", "₱750K", "₱1M+"];

const PROCESSING_DAYS_OPTIONS = [
    { value: "", label: "All" },
    { value: "current", label: "Current" },
    { value: "30-days", label: "1-30 days" },
    { value: "31-60-days", label: "31-60 days" },
    { value: "61-90-days", label: "61-90 days" },
    { value: "91-over", label: "Over 90 days" },
];

export default function Filters({ setShowFilters, userAreas, filters }) {
    const [selectedArea, setSelectedArea] = useState(filters.area || "");
    const [selectedProcesingDays, setSelectedProcessingDays] = useState(filters.processing_days || "");
    const [minAmountIndex, setMinAmountIndex] = useState(filters.min_amount === "negative"
        ? 0
        : filters.min_amount
        ? AMOUNT_STEPS.indexOf(Number(filters.min_amount))
        : 0
    );
    const [maxAmountIndex, setMaxAmountIndex] = useState(filters.max_amount ? AMOUNT_STEPS.indexOf(Number(filters.max_amount)) : 5);

    const handleClearFilters = () => {
        setSelectedArea("");
        setSelectedProcessingDays("");
        setMinAmountIndex(0);
        setMaxAmountIndex(5);

        router.get(
            "/updates",
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const applyFilters = (overrides = {}) => {
        const current = {
            selected_area: selectedArea,
            processing_days: selectedProcesingDays,
            per_page: filters.per_page,
            min_amount: minAmountIndex === 0 ? "negative" : AMOUNT_STEPS[minAmountIndex],
            max_amount: maxAmountIndex === 5 ? null : AMOUNT_STEPS[maxAmountIndex],
            ...overrides,
        };

        router.get("/updates", current, { preserveState: true, preserveScroll: true });
    };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-90 bg-base-100 shadow-lg pt-6 pb-18 px-6 z-50 transition-transform duration-300">
        <div className="flex justify-between mb-6">
            <p className="text-xl">Filter Options</p>
            <X size={20} onClick={() => setShowFilters(false)} className="cursor-pointer" />
        </div>
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col justify-center gap-6">
                <div>
                    <label className="label text-md">By Area</label>
                    <select
                        className="select w-full rounded-xl"
                        value={selectedArea}
                        onChange={(e) => {
                            setSelectedArea(e.target.value);
                            applyFilters({ selected_area: e.target.value });
                            setShowFilters(false);
                        }}
                    >
                        <option value="">Select</option>
                        {userAreas.map((area) => (
                            <option key={area.id} value={area.id}>{area.area_name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label text-md">By Processing Days</label>
                    <select
                        className="select w-full rounded-xl"
                        value={selectedProcesingDays}
                        onChange={(e) => {
                            setSelectedProcessingDays(e.target.value);
                            applyFilters({ processing_days: e.target.value });
                            setShowFilters(false);
                        }}
                    >
                        {PROCESSING_DAYS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="label text-md">By Amount</label>

                    <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Min Amount</p>
                        <input
                            type="range"
                            min={0}
                            max={5}
                            value={minAmountIndex}
                            step={1}
                            className="range range-xs"
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                const newMin = val;
                                const newMax = val > maxAmountIndex ? val : maxAmountIndex;
                                setMinAmountIndex(newMin);
                                setMaxAmountIndex(newMax);
                                applyFilters({
                                    min_amount: newMin === 0 ? "negative" : AMOUNT_STEPS[newMin],
                                    max_amount: newMax === 5 ? null : AMOUNT_STEPS[newMax]
                                });
                            }}
                        />
                        <div className="flex justify-between px-2.5 mt-1 text-xs text-gray-400">
                            {AMOUNT_LABELS.map((_, i) => <span key={i}>|</span>)}
                        </div>
                        <div className="flex justify-between px-2.5 mt-1 text-xs">
                            {AMOUNT_LABELS.map((label, i) => <span key={i}>{label}</span>)}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Max Amount</p>
                        <input
                            type="range"
                            min={0}
                            max={5}
                            value={maxAmountIndex}
                            step={1}
                            className="range range-xs"
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                const newMax = val;
                                const newMin = val < minAmountIndex ? val : minAmountIndex;
                                setMaxAmountIndex(newMax);
                                setMinAmountIndex(newMin);
                                applyFilters({
                                    min_amount: newMin === 0 ? "negative" : AMOUNT_STEPS[newMin],
                                    max_amount: newMax === 5 ? null : AMOUNT_STEPS[newMax],
                                });
                            }}
                        />
                        <div className="flex justify-between px-2.5 mt-1 text-xs text-gray-400">
                            {AMOUNT_LABELS.map((_, i) => <span key={i}>|</span>)}
                        </div>
                        <div className="flex justify-between px-2.5 mt-1 text-xs">
                            {AMOUNT_LABELS.map((label, i) => <span key={i}>{label}</span>)}
                        </div>
                    </div>

                    <p className="text-sm text-center mt-3 text-gray-600 bg-base-200 rounded-lg py-1">
                        {AMOUNT_LABELS[minAmountIndex]} - {AMOUNT_LABELS[maxAmountIndex]}
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <button className="btn btn-outline rounded-3xl w-full" onClick={handleClearFilters}>
                    Clear Filters
                </button>
            </div>
        </div>
    </div>
  )
}
