import { useMemo, useState } from "react";
import Master from "../components/Master";
import { FileText } from "lucide-react";
import { buildSummaryParts } from "../utils/exportHelpers";

export default function Index({ areas, hospitals }) {
    const [filterType, setFilterType] = useState("overall");
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState([]);
    const [selectedAging, setSelectedAging] = useState([]);
    const [agingAll, setAgingAll] = useState(false);

    const areaItems = useMemo(() => {
        areas.map((a) => ({ value: String(a.id), label: a.area_name }));
    }, [areas]);

    const hospitalItems = useMemo(() => {
        hospitals.map((h) => ({ value: String(h.id), label: h.hospital_name }));
    }, [hospitals]);

    const summaryParts = useMemo(() => {
        buildSummaryParts({
            filterType,
            selectedAreas,
            selectedHospital,
            selectedAging,
            agingAll,
            areas,
            hospitals,
        });
    }, [
        filterType,
        selectedAreas,
        selectedHospital,
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
                    <div>
                        <div>
                            <div className="px-5 py-3.5 border-b border-base-200 bg-base-50">
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

                                <div>
                                  {summaryParts.length === 0 ? (
                                    <p className="text-xs text-base-content/40 italic">
                                      No filters configured yet.
                                    </p>
                                  ) : (
                                    summaryParts.map()
                                  )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
