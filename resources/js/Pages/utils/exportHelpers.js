export const AGING_BUCKETS = [
    { value: "current", label: "Current", desc: "Not yet due" },
    { value: "30", label: "1-30 Days", desc: "1 to 30 days overdue" },
    { value: "31-60", label: "31-60 Days", desc: "31 to 60 days overdue" },
    { value: "61-90", label: "61-90 Days", desc: "61 to 90 days overdue" },
    { value: "over_90", label: "91 Over", desc: "More than 90 days overdue" },
];

const PILL_LIMIT = 20;

function truncatePills(names) {
    if (names.length <= PILL_LIMIT) return names;
    const remaining = names.length - PILL_LIMIT;
    return [...names.slice(0, PILL_LIMIT), `+${remaining} more`]
}

export function buildExportParams({
    filterType,
    selectedAreas,
    selectedHospitals,
    selectedAging
}) {
    const params = new URLSearchParams();

    params.append("filter_type", filterType);

    if (filterType === "area") {
        selectedAreas.forEach((id) => params.append("area_id[]", id));
    }

    if (filterType === "hospital") {
        selectedHospitals.forEach((id) => params.append("hospital_id[]", id));
    }

    selectedAging.forEach((bucket) => params.append("aging_filter[]", bucket));

    return params;
}

export function buildSummaryParts({
    filterType,
    selectedAreas,
    selectedHospitals,
    selectedAging,
    agingAll,
    areas,
    hospitals
}) {
    const parts = [];

    const scopeLabels = {
        overall: "Overall - All Areas & Hospitals",
        area: "By Area",
        hospital: "By Hospital"
    }
    parts.push({ label: "Scope", value: scopeLabels[filterType], pills: null });

    if (filterType === "area") {
        if (selectedAreas.length === 0) {
            parts.push({ label: "Areas", value: "None selected", pills: null });
        } else if (selectedAreas.length === areas.length) {
            parts.push({ label: "Areas", value: "All Areas", pills: ["All Areas"] })
        } else {
            const names = areas
                .filter((a) => selectedAreas.includes(String(a.id)))
                .map((a) => a.area_name)
            parts.push({ label: "Areas", value: null, pills: names });
        }
    }

    if (filterType === "hospital") {
        if (selectedHospitals.length === 0) {
            parts.push({ label: "Hospitals", value: "None selected", pills: null });
        } else if (selectedHospitals.length === hospitals.length) {
            parts.push({ label: "Hospitals", value: "All Hospitals", pills: ["All Hospitals"] })
        } else {
            const names = hospitals
                .filter((h) => selectedHospitals.includes(String(h.id)))
                .map((h) => h.hospital_name)
            parts.push({ label: "Hospitals", value: null, pills: truncatePills(names) });
        }
    }

    if (selectedAging.length === 0) {
        parts.push({ label: "Aging", value: "None selected", pills: null });
    } else if (agingAll) {
        parts.push({ label: "Aging", value: "All Periods", pills: ["All Periods"] })
    } else {
        const orderedLabels = AGING_BUCKETS
            .filter((b) => selectedAging.includes(b.value))
            .map((b) => b.label)
        parts.push({ label: "Aging", value: null, pills: orderedLabels  });
    }

    return parts;
}