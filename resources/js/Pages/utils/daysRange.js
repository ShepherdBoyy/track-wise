export const STOPS = [
    { label: "Current", min: null, max: 0 },
    ...Array.from({ length: 10 }, (_, i) => ({
        label: String(i * 10),
        min: i * 10,
        max: i * 10,
    })),
    { label: "90+", min: 91, max: null }
];

export const LAST_STOP = STOPS.length - 1;
export const DEFAULT_RANGE = { lo: 0, hi: LAST_STOP };

export function rangeToParams(lo, hi) {
    return {
        min_days: STOPS[lo].min ?? undefined,
        max_days: STOPS[hi].max ?? undefined,
    }
}

export function paramsToRange(minDays, maxDays) {
    let lo = 0;
    if (minDays !== null && minDays !== undefined && minDays !== "") {
        lo = STOPS.reduce(
            (best, stop, i) => (stop.min !== null && stop.min <= minDays ? i : best)
        );
    }

    let hi = LAST_STOP;
    if (maxDays !== null && maxDays !== undefined && maxDays !== "") {
        const found = STOPS.findIndex((stop) => stop.max !== null && stop.max >= maxDays);
        hi = found === -1 ? LAST_STOP : Math.max(found, 1);
    }

    return { lo, hi: Math.max(hi, lo) };
}