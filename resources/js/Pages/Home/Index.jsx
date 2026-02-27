import {
    CalendarX2,
    DollarSign,
    ExternalLink,
    FileText,
    TrendingUp,
} from "lucide-react";
import Master from "../components/Master";
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "@inertiajs/react";

export default function Index({ kpi, agingBreakdown, topAreas, topHospitals }) {

    console.log(topHospitals);

    const AgingTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
                    <p className="font-semibold mb-2">{data.category}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm">
                            <span className="font-medium">{entry.name}:</span>{' '}
                            {entry.name === 'Amount' 
                                ? Intl.NumberFormat("en-PH", {
                                    style: "currency",
                                    currency: "PHP",
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  }).format(entry.value || 0)
                                : entry.value.toLocaleString()
                            }
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const DonutTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            
            return (
                <div className="bg-base-100 p-3 rounded-lg shadow-xl border border-base-300">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">{data.value.toLocaleString()} invoices ({data.payload.percentage}%)</p>
                </div>
            )
        }
    };

    const getMedalIcon = (rank) => {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return rank;
        }
    };

  return (
    <Master>
        <div className="bg-base-200 space-y-6">
            <div className="mb-4">
                <span className="text-2xl">Dashboard</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-sm font-medium opacity-70 mb-2">
                                    Total Outstanding
                                </h2>
                                <p className="text-2xl font-bold">
                                    ₱{" "}{(kpi.totalOutstanding / 1000000).toFixed(2)}M
                                </p>
                                <p className="text-sm opacity-60 mt-2">
                                    {kpi.totalCount.toLocaleString()} invoices
                                </p>
                            </div>
                            <div className="p-3 bg-four rounded-full ">
                                <DollarSign size={24} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-sm font-medium opacity-70 mb-2">Total Overdue</h2>
                                <p className="text-2xl font-bold">
                                    ₱{" "}{(kpi.totalOverdue / 1000000).toFixed(2)}M
                                </p>
                                <p className="text-sm mt-2">
                                    <span className="font-semibold text-error">{kpi.overduePercentage}%</span>
                                    <span className="opacity-60"> of outstanding</span>
                                </p>
                            </div>
                            <div className="p-3 bg-three rounded-full">
                                <CalendarX2 size={24} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-sm font-medium opacity-70 mb-2">
                                    Average Invoice Amount
                                </h2>
                                <p className="text-2xl font-bold">
                                    ₱{" "}{(kpi.avgInvoiceAmount / 1000).toFixed(1)}K
                                </p>
                                <p className="text-sm opacity-60 mt-2">
                                    per oustanding invoices
                                </p>
                            </div>
                            <div className="p-3 bg-five rounded-full">
                                <TrendingUp size={24} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h2 className="text-sm font-medium opacity-70 mb-2">Total Invoices</h2>
                                <p className="text-2xl font-bold">
                                    {kpi.totalCount.toLocaleString()} invoices
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <div className="badge badge-info badge-sm">
                                        {kpi.openCount.toLocaleString()} open
                                    </div>
                                    <div className="badge bg-rose-300 badge-sm">
                                        {kpi.overdueCount.toLocaleString()} overdue
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-two rounded-full">
                                <FileText size={24} strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Aging Analysis</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={agingBreakdown}
                                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                <XAxis 
                                    dataKey="category"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    orientation="left"
                                    tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip content={<AgingTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                                <Bar 
                                    yAxisId="left"
                                    dataKey="amount" 
                                    name="Amount"
                                    barSize={50}
                                    radius={[8, 8, 0, 0]}
                                    fill="#B9E69E"
                                />
                                <Bar 
                                    yAxisId="right"
                                    dataKey="count" 
                                    name="Count"
                                    barSize={50}
                                    fill="#55548F"
                                    opacity={0.6}
                                    radius={[8, 8, 0, 0]}
                                />
                                
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title">Top 5 High-Volume Areas</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={topAreas}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                />
                                <Tooltip content={<DonutTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    formatter={(value, entry) => (
                                        <span className="text-sm">{entry.payload.name} ({entry.payload.percentage})</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="card-title">Top 10 Hospital by Outstanding</h2>
                        <Link href="/hospitals" className="btn btn-sm btn-ghost tooltip" data-tip="View All Hospitals">
                            <ExternalLink size={18} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th className="w-16">Rank</th>
                                    <th>Hospital</th>
                                    <th>Area</th>
                                    <th className="text-right">Outstanding</th>
                                    <th className="text-center">Invoices</th>
                                    <th className="text-center">Overdue</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topHospitals.map((hospital) => (
                                    <tr key={hospital.id}>
                                        <td className="font-bold text-center text-md">
                                            {getMedalIcon(hospital.rank)}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar avatar-placeholder">
                                                    <div className="bg-neutral text-neutral-content w-8 rounded-full">
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
                                                <div>
                                                    <div className="font-semibold">{hospital.hospital_name}</div>
                                                    <div className="text-xs opacity-50">{hospital.hospital_number}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="badge badge-sm text-white" style={{ backgroundColor: hospital.area_color }}>
                                                {hospital.area_name}
                                            </div>
                                        </td>
                                        <td className="text-right font-semibold">
                                            {Intl.NumberFormat("en-PH", {
                                                style: "currency",
                                                currency: "PHP",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                            }).format(hospital.outstanding_amount)}
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
        </div>
    </Master>
  )
}
