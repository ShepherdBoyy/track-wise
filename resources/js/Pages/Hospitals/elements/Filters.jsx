import { router } from "@inertiajs/react";
import { X } from "lucide-react";

export default function Filters({ setShowFilters, userAreas, filters, selectedArea, setSelectedArea }) {
    const handleClearFilters = () => {
        setSelectedArea("");

        const params = {
            hospital_search: filters.search || undefined,
            sort_by: filters.sort_by || undefined,
            sort_order: filters.sort_order || undefined,
            per_page: filters.per_page || undefined,
        };

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );

        router.get("/hospitals", cleanParams, {
            preserveScroll: true,
            preserveState: true
        });
    }

    const handleAreaChange = (value) => {
        setSelectedArea(value);

        const params = {
            hospital_search: filters.search || undefined,
            sort_by: filters.sort_by,
            sort_order: filters.sort_order,
            selected_area: value || undefined,
            per_page: filters.per_page || undefined,
        };

        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );

        router.get("/hospitals", cleanParams, {
                preserveState: true,
                preserveScroll: true
            }
        )
        setShowFilters(false);
    }

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-90 bg-base-100 shadow-lg pt-6 pb-18 px-6 z-50 transition-transform duration-300">
        <div className="flex justify-between mb-6">
            <p className="text-xl">Filter Options</p>
            <X size={20} onClick={() => setShowFilters(false)} className="cursor-pointer" />
        </div>
        <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col overflow-y-auto">
                <label className="label text-md">
                    By Area
                </label>
                <div className="space-y-4 mt-4">
                    <label className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded-lg">
                        <input
                            type="radio"
                            className="radio"
                            name="selected_area"
                            value=""
                            checked={selectedArea === ""}
                            onChange={() => handleAreaChange("")}
                        />
                        <span className="text-sm font-medium">All Areas</span>
                    </label>
                    {userAreas.map((area) => (
                        <label 
                            key={area.id} 
                            className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-2 rounded-lg"
                        >
                            <input
                                type="radio"
                                className="radio"
                                name="selected_area"
                                checked={selectedArea === area.id}
                                onChange={() => handleAreaChange(area.id)}
                            />
                            <span className="text-sm">{area.area_name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <button
                    className="btn btn-outline rounded-3xl w-full"
                    onClick={handleClearFilters}
                >
                    Clear Filter
                </button>
            </div>
        </div>
    </div>
  )
}
