import { useMemo, useState } from "react";
import Master from "../components/Master";
import { FileText } from "lucide-react";
import { buildSummaryParts } from "../utils/exportHelpers";
import SectionCard from "./elements/SectionCard";
import SearchableCheckboxList from "./elements/SearchableCheckboxList";

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

    const summaryParts = useMemo(() => {
        buildSummaryParts({
            filterType,
            selectedAreas,
            selectedHospitals,
            selectedAging,
            agingAll,
            areas,
            hospitals,
        });
    }, [
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
                                                : "border-base-300 bg-base-100"
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
                            <SectionCard step={2} title="Select Areas">
                                <SearchableCheckboxList
                                    items={areaItems}
                                    selected={selectedAreas}
                                    onChange={setSelectedAreas}
                                    placeholder="Search areas..."
                                    emptyMessage="No areas available."
                                    showSearch={false}
                                />
                            </SectionCard>
                        )}
                    </div>

                    <div>
                        <div>
                            <div className="px-5 py-3.5 border-b border-base-300 bg-base-50">
                                <span className="font-semibold text-sm">
                                    Report Summary
                                </span>
                            </div>

                            <div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wide">
                                        Report
                                    </span>
                                    <span className="font-semibold text-sm">
                                        Invoice Aging Report
                                    </span>
                                </div>

                                <div className="divider my-0" />

                                {/* <div>
                                  {summaryParts.length === 0 ? (
                                    <p className="text-xs text-base-content/40 italic">
                                      No filters configured yet.
                                    </p>
                                  ) : (
                                    summaryParts.map((part, i) => (
                                        <div key={i}>
                                            <span>
                                                {part.label}
                                            </span>
                                            <span>
                                                {part.value}
                                            </span>
                                        </div>
                                    ))
                                  )}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
