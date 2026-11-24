import { LAST_STOP, STOPS } from "../../utils/daysRange";

const THUMB = 16;

const pos = (index) => {
    const pct = (index / LAST_STOP) * 100;
    return `calc(${pct}% + ${(0.5 - pct / 100) * THUMB}px)`;
}

export default function DayRangeSlider({ lo, hi, onChange, onCommit }) {
    const handleLo = (e) => onChange(Math.min(Number(e.target.value), hi), hi);
    const handleHi = (e) => onChange(lo, Math.max(Number(e.target.value), lo, 1));
    const commit = () => onCommit(lo, hi);

    const isDefault = lo === 0 && hi === LAST_STOP;
    const loOnTop = lo === hi && lo >= LAST_STOP / 2;

    return (
        <div>
            <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-base-content/60"></span>
                <span className="text-sm font-semibold">
                    {isDefault ? "All" : `${STOPS[lo].label} \u2013 ${STOPS[hi].label}`}
                </span>
            </div>

            <div className="relative h-4 mx-1">
                <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-base-300" />
                
                <div
                    className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-black"
                    style={{ left: pos(lo), width: `calc(${pos(hi)} - ${pos(lo)})` }}
                />

                {STOPS.map((stop, i) => (
                    <span
                        key={stop.label}
                        className="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-base-content/30"
                        style={{ left: pos(i) }}
                    />
                ))}

                <input
                    type="range"
                    className="range-dual"
                    style={{ zIndex: loOnTop ? 30 : 10 }}
                    min={0}
                    max={LAST_STOP}
                    step={1}
                    value={lo}
                    onChange={handleLo}
                    onPointerUp={commit}
                    onKeyUp={commit}
                    aria-label="Minimum days overdue"
                    aria-valuetext={STOPS[lo].label}
                />

                <input
                    type="range"
                    className="range-dual"
                    style={{ zIndex: 20 }}
                    min={0}
                    max={LAST_STOP}
                    step={1}
                    value={hi}
                    onChange={handleHi}
                    onPointerUp={commit}
                    onKeyUp={commit}
                    aria-label="Maximum days overdue"
                    aria-valuetext={STOPS[hi].label}
                />
            </div>

            <div className="flex justify-between mt-3 text-[11px] text-base-content/60">
                <span>Current</span>
                <span>90+</span>
            </div>
        </div>
    );
}