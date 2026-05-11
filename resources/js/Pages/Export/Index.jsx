import { useMemo, useState } from "react";
import Master from "../components/Master";
import { AlertCircle, Download, FileText } from "lucide-react";
import { AGING_BUCKETS, buildExportParams, buildSummaryParts } from "../utils/exportHelpers";
import SectionCard from "./elements/SectionCard";
import SearchableCheckboxList from "./elements/SearchableCheckboxList";
import AgingPeriodSelector from "./elements/AgingPeriodSelector";
import SelectAllButton from "../components/SelectAllButton"
;
export default function Index({ areas, hospitals }) {
    const [filterType, setFilterType] = useState("overall");
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [selectedHospitals, setSelectedHospitals] = useState([]);
    const [selectedAging, setSelectedAging] = useState([]);
    const [agingAll, setAgingAll] = useState(false);

    const areaItems = useMemo(() => 
        areas.map((a) => ({ value: String(a.id), label: a.area_name })),
        [areas]
    );

    const hospitalItems = useMemo(() => 
        hospitals.map((h) => ({ value: String(h.id), label: h.hospital_name })),
        [hospitals]
    );

    const handleAgingAll = () => {
        if (agingAll) {
            setAgingAll(false);
            setSelectedAging([]);
        } else {
            setAgingAll(true);
            setSelectedAging(AGING_BUCKETS.map((b) => b.value));
        }
    }

    const handleAgingBucket = (value) => {
        const next = selectedAging.includes(value)
            ? selectedAging.filter((v) => v !== value)
            : [...selectedAging, value];
        setSelectedAging(next);
        setAgingAll(next.length === AGING_BUCKETS.length);
    }

    const errors = useMemo(() => {
        const e = [];
        if (filterType === "area" && selectedAreas.length === 0)
            e.push("Select at least one area");
        if (filterType === "hospital" && selectedHospitals.length === 0)
            e.push("Select at least one hospital");
        if (selectedAging.length === 0)
            e.push("Select at least one aging period");
        return e;
    }, [filterType, selectedAreas, selectedHospitals, selectedAging]);

    const summaryParts = useMemo(() => 
        buildSummaryParts({
            filterType,
            selectedAreas,
            selectedHospitals,
            selectedAging,
            agingAll,
            areas,
            hospitals,
        }), [
        filterType,
        selectedAreas,
        selectedHospitals,
        selectedAging,
        agingAll,
        areas,
        hospitals,
    ]);

    return (
        <Master>
            <div className="flex flex-col gap-6 w-full">
                <span className="text-2xl">Export Data</span>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
                    <div className="xl:col-span-2 flex flex-col gap-4">
                        <SectionCard step={1} title="Filter By">
                            <div className="flex flex-col sm:flex-row gap-3">
                                {[
                                    { value: "overall", label: "Overall", desc: "All areas & hospitals" },
                                    { value: "area", label: "By Area", desc: "Select specific areas" },
                                    { value: "hospital", label: "By Hospital", desc: "Select specific hospitals" },
                                ].map(({ value, label, desc }) => (
                                    <label
                                        key={value}
                                        className={`flex items-center gap-3 flex-1 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                                            filterType === value
                                                ? "border-primary bg-primary/5"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="filter_type"
                                            className="radio radio-primary radio-sm"
                                            value={value}
                                            checked={filterType === value}
                                            onChange={() => {
                                                setFilterType(value);
                                                setSelectedAreas([]);
                                                setSelectedHospitals([]);
                                            }}
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">
                                                {label}
                                            </span>
                                            <span className="text-xs text-base-content/50">
                                                {desc}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </SectionCard>

                        {filterType === "area" && (
                            <SectionCard
                                step={2}
                                title="Select Areas"
                                headerAction={
                                    <SelectAllButton
                                        total={areaItems.length}
                                        selected={selectedAreas.length}
                                        onToggle={() => 
                                            setSelectedAreas(selectedAreas.length === areaItems.length
                                                ? []
                                                : areaItems.map((i) => i.value)
                                            )
                                        }   
                                    />
                                }
                            >
                                <SearchableCheckboxList
                                    items={areaItems}
                                    selected={selectedAreas}
                                    onChange={setSelectedAreas}
                                    placeholder="Search areas..."
                                    emptyMessage="No areas available."
                                    showSearch={false}
                                    columns={3}
                                />
                            </SectionCard>
                        )}

                        {filterType === "hospital" && (
                            <SectionCard
                                step={2}
                                title="Select Hospitals"
                                headerAction={
                                    <SelectAllButton
                                        total={hospitalItems.length}
                                        selected={selectedHospitals.length}
                                        onToggle={() => 
                                            setSelectedHospitals(selectedHospitals.length === hospitalItems.length
                                                ? []
                                                : hospitalItems.map((i) => i.value)
                                            )
                                        }
                                    />
                                }
                            >
                                <SearchableCheckboxList
                                    items={hospitalItems}
                                    selected={selectedHospitals}
                                    onChange={setSelectedHospitals}
                                    placeholder="Search hospitals..."
                                    emptyMessage="No hospitals available."
                                    showSearch={true}
                                    columns={1}
                                />
                            </SectionCard>
                        )}

                        <SectionCard
                            step={filterType === "overall" ? 2 : 3}
                            title="Select Aging"
                        >
                            <AgingPeriodSelector
                                selectedAging={selectedAging}
                                agingAll={agingAll}
                                onAgingAll={handleAgingAll}
                                onAgingBucket={handleAgingBucket}
                            />
                        </SectionCard>
                    </div>

                    <div className="sticky top-4">
                        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
                            <div className="px-5 py-4 border-b border-base-300 bg-base-50 text-center">
                                <span className="font-semibold text-sm">
                                    Report Summary
                                </span>
                            </div>

                            <div className="px-5 py-4 flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                                        Report
                                    </span>
                                    <span className="font-semibold text-sm">
                                        Invoice Aging Report
                                    </span>
                                </div>

                                <div className="divider my-0" />

                                <div className="flex flex-col gap-3">
                                  {summaryParts.length === 0 ? (
                                    <p className="text-xs text-base-content/40 italic">
                                      No filters configured yet.
                                    </p>
                                  ) : (
                                    summaryParts.map((part, i) => (
                                        <div key={i} className="flex flex-col gap-0.5">
                                            <span className="text-xs text-base-content/50 uppercase tracking-wide font-semibold">
                                                {part.label}
                                            </span>
                                            <span className="text-sm text-base-content">
                                                {part.value}
                                            </span>
                                        </div>
                                    ))
                                  )}
                                </div>

                                <div className="divider my-0" />

                                {errors.length > 0 && (
                                    <div className="flex flex-col gap-1.5">
                                        {errors.map((error, index) => (
                                            <div key={index} className="flex items-start gap-2 text-xs text-error">
                                                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                                                <span>{error}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    disabled={errors.length !== 0}
                                    className="btn btn-primary btn-sm w-full gap-2"
                                    onClick={() => {
                                        if (errors.length !== 0) return;
                                        const params = buildExportParams({
                                            filterType,
                                            selectedAreas,
                                            selectedHospitals,
                                            selectedAging
                                        })
                                        window.location.href = `/export/invoice-aging-report?${params.toString()}`;
                                    }}
                                >
                                    <Download size={14} />
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}