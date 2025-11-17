import { router } from "@inertiajs/react";
import Master from "../components/Master";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import Create from "./Create";

export default function Index({ hospitals }) {
    const [open, setOpen] = useState(false);

    return (
        <Master>
            <div className="px-10 bg-base-200 min-h-screen">
                <div className="p-6 bg-white rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xl">All Hospitals</span>
                        <button
                            className="btn btn-neutral rounded-xl text-sm"
                            onClick={() => setOpen(true)}
                        >
                            <Plus size={18} />
                            Add Hospital
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Hospital Name</th>
                                    <th>Number of Invoices</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospitals.data.map((hospital, index) => (
                                    <tr
                                        key={hospital.id}
                                        className="hover:bg-base-300 cursor-pointer"
                                        onClick={() =>
                                            router.get(`/invoices`, {
                                                hospital_id: hospital.id,
                                                processing_days: "0-30 days",
                                                invoices_count:
                                                    hospital.invoices_count,
                                            })
                                        }
                                    >
                                        <td>{index + 1}</td>
                                        <td>{hospital.hospital_name}</td>
                                        <td>{hospital.invoices_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="join flex justify-end mt-4">
                        {hospitals.links.map((link, index) => {
                            const isPrevious = link.label
                                .toLowerCase()
                                .includes("previous");
                            const isNext = link.label
                                .toLowerCase()
                                .includes("next");

                            return (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    className={`
                                    join-item btn
                                    ${
                                        link.active
                                            ? "bg-neutral-800 text-white"
                                            : ""
                                    }
                                    ${
                                        !link.url
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }
                                `}
                                >
                                    {isPrevious ? (
                                        <ChevronLeft size={18} />
                                    ) : isNext ? (
                                        <ChevronRight size={18} />
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {open && <Create setOpen={setOpen} />}
                </div>
            </div>
        </Master>
    );
}
