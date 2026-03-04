import { Link, router } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react'
import SortIcon from '../../components/SortIcon';

export default function TopTenHospitals({ topHospitals }) {
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedHospitals = [...topHospitals].sort((a, b) => {
        let comparison = 0;

        switch(sortBy) {
            case "rank":
                comparison = a.rank - b.rank;
                break;
            case "name":
                comparison = a.hospital_name.localeCompare(b.hospital_name);
                break;
            case "area":
                comparison = a.area_name.localeCompare(b.area_name);
                break;
            case "outstanding":
                comparison = a.outstanding_amount - b.outstanding_amount;
                break;
            case "invoices":
                comparison = a.invoice_count - b.invoice_count;
                break;
        }

        return sortOrder === "asc" ? comparison : -comparison;
    });

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("desc");
        }
    }

  return (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <div className="flex justify-between items-center mb-2">
                <h2 className="card-title">Top 10 Hospital by Outstanding</h2>
                <Link href="/hospitals" className="btn btn-sm btn-ghost tooltip" data-tip="View All Hospitals">
                    <ExternalLink size={18} />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra table-sm">
                    <thead>
                        <tr className="text-xs">
                            <th
                                className="w-20 cursor-pointer hover:bg-base-200"
                                onClick={() => handleSort("rank")}
                            >
                                <div className="flex items-center gap-2">
                                    Rank
                                    <SortIcon column="rank" sortOrder={sortOrder} sortBy={sortBy} />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => handleSort("name")}
                            >
                                <div className="flex items-center gap-2">
                                    Hospital
                                    <SortIcon column="name" sortOrder={sortOrder} sortBy={sortBy} />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => handleSort("area")}
                            >
                                <div className="flex items-center gap-2">
                                    Area
                                    <SortIcon column="area" sortOrder={sortOrder} sortBy={sortBy} />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => handleSort("outstanding")}
                            >
                                <div className="flex items-center justify-end gap-2">
                                    Outstanding
                                    <SortIcon column="outstanding" sortOrder={sortOrder} sortBy={sortBy} />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-200"
                                onClick={() => handleSort("invoices")}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Invoices
                                    <SortIcon column="invoices" sortOrder={sortOrder} sortBy={sortBy} />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHospitals.map((hospital) => (
                            <tr
                                key={hospital.id}
                                className="hover:bg-base-300 cursor-pointer transition-colors"
                                onClick={() => router.get(`/hospitals/${hospital.id}/invoices`)}
                            >
                                <td className="font-bold text-center">
                                    {(() => {
                                        switch(hospital.rank) {
                                            case 1: return <span className="text-base">🥇</span>;
                                            case 2: return <span className="text-base">🥈</span>;
                                            case 3: return <span className="text-base">🥉</span>;
                                            default: return <span className="text-xs">{hospital.rank}</span>;
                                        }
                                    })()}
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <div className="avatar avatar-placeholder">
                                            <div className="bg-neutral text-neutral-content w-7 h-7 rounded-full">
                                                <span className="text-xs">
                                                    {hospital.hospital_name
                                                        .split(" ")
                                                        .slice(0, 2)
                                                        .map(word => word[0])
                                                        .join("")
                                                        .toUpperCase()
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-sm truncate">{hospital.hospital_name}</div>
                                            <div className="text-[10px] opacity-50">{hospital.hospital_number}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="badge badge-sm" style={{ backgroundColor: hospital.area_color }}>
                                        {hospital.area_name}
                                    </div>
                                </td>
                                <td className="text-right font-semibold text-sm">
                                    <span className="hidden sm:inline">
                                        {Intl.NumberFormat("en-PH", {
                                            style: "currency",
                                            currency: "PHP",
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 2,
                                        }).format(hospital.outstanding_amount)}
                                    </span>
                                    <span className="sm:hidden">
                                        ₱{(hospital.outstanding_amount / 1000000).toFixed(1)}M
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="badge badge-neutral badge-sm">{hospital.invoice_count}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
