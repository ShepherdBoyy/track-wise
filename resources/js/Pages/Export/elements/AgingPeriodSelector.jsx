import {
    AGING_BUCKETS,
    isAgingBucketDisabled,
} from "../../utils/exportHelpers";

export default function AgingPeriodSelector({
    selectedAging,
    agingAll,
    onAgingAll,
    onAgingBucket,
}) {
    return (
        <div className="flex flex-col gap-3">
            <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    agingAll
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                }`}
            >
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={agingAll}
                    onChange={onAgingAll}
                />
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                        All Aging Periods
                    </span>
                    <span className="text-xs text-base-content/50">
                        Include every aging period in the report
                    </span>
                </div>
            </label>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-base-300" />
                <span className="text-xs text-base-content/40">
                    or select individually
                </span>
                <div className="flex-1 h-px bg-base-300" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {AGING_BUCKETS.map((bucket) => {
                    const disabled = isAgingBucketDisabled(
                        bucket.value,
                        selectedAging,
                    );

                    return (
                        <label
                            key={bucket.value}
                            title={disabled ? "Clear the other range options to use this one" : undefined}
                            className={`flex items-center gap-3 px-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                              disabled
                                ? "border-gray-200 opacity-40 cursor-not-allowed"
                                : selectedAging.includes(bucket.value)
                                    ? "border-primary bg-primary/5 cursor-pointer"
                                    : "border-gray-200 hover:border-gray-300 cursor-pointer"
                            }`}
                        >
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary checkbox-sm"
                                checked={selectedAging.includes(bucket.value)}
                                disabled={disabled}
                                onChange={() => onAgingBucket(bucket.value)}
                            />

                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">{bucket.label}</span>
                                <span className="text-xs text-base-content/50">{bucket.desc}</span>
                            </div>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}