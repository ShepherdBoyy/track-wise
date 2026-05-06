export const AGING_BUCKETS = [
    { value: "current", label: "Current", desc: "Not yet due" },
    { value: "30", label: "1-30 Days", desc: "1 to 30 days overdue" },
    { value: "31-60", label: "31-60 Days", desc: "31 to 60 days overdue" },
    { value: "61-90", label: "61-90 Days", desc: "61 to 90 days overdue" },
    { value: "over_90", label: "91 Over", desc: "More than 90 days overdue" },
];

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
    parts.push({ label: "Scope", value: scopeLabels[filterType] });

    if (filterType === "area") {
        if (selectedAreas.length === 0) {
            parts.push({ label: "Areas", value: "None selected" });
        } else {
            const names = areas
                .filter((a) => selectedAreas.includes(String(a.id)))
                .map((a) => a.area_name)
                .join(", ");
            parts.push({ label: "Areas", value: names })
        }
    }

    if (filterType === "hospital") {
        if (selectedHospitals.length === 0) {
            parts.push({ label: "Hospitals", value: "None selected" });
        } else {
            const names = hospitals
                .filter((h) => selectedHospitals.includes(String(h.id)))
                .map((h) => h.hospital_name)
                .join(", ")
            parts.push({ label: "Hospitals", value: names });
        }
    }

    if (selectedAging.length === 0) {
        parts.push({ label: "Aging", value: "None selected" });
    } else if (agingAll) {
        parts.push({ label: "Aging", value: "All Periods" })
    } else {
        const labels = selectedAging
            .map((v) => AGING_BUCKETS.find((b) => b.value === v)?.label)
            .filter(Boolean)
            .join(", ");
        parts.push({ label: "Aging", value: labels });
    }

    return parts;
}