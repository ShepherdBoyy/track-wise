import {
    CalendarX2,
    ChevronDown,
    DollarSign,
    ExternalLink,
    FileText,
    TrendingUp,
} from "lucide-react";
import Master from "../components/Master";
import { Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import SortIcon from "../components/SortIcon";

export default function Index({
    kpi,
    agingBreakdown,
    topAreas,
    topHospitals,
    monthlyOutstanding,
    invoiceVolume
}) {
    const [selectedYear, setSelectedYear] = useState(monthlyOutstanding.currentYear);
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

    const handleYearChange = (year) => {
        setSelectedYear(year);
        router.get("/",
            { year },
            { preserveScroll: true, preserveState: true }
        )
    }

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
                                : Intl.NumberFormat("en-PH", {
                                    useGrouping: true,
                                }).format(entry.value || 0)

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

    const OutstandingTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            console.log(data);
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
                    <p className="font-semibold mb-2">{data.month}</p>
                    <p className="text-sm">
                        {Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                        }).format(data.amount || 0)}
                    </p>
                </div>
            );
        }
        return null;
    };

    const VolumeTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
                    <p className="font-semibold mb-2">{data.month}</p>
                    <p className="text-sm">{data.count.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    }

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title">Monthly Outstanding Trend</h2>
                            
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
                                    {selectedYear}
                                    <ChevronDown className="w-4 h-4" />
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                                    {monthlyOutstanding.availableYears.map((year) => (
                                        <li key={year}>
                                            <a className={selectedYear === year ? 'active' : ''} onClick={() => handleYearChange(year)}>
                                                {year}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={monthlyOutstanding.data.map(item => ({
                                    ...item,
                                    amount: item.amount === 0 ? null : item.amount
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                                <Tooltip content={<OutstandingTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#55548F"
                                    strokeWidth={3}
                                    activeDot={{ r: 6 }}
                                    connectNulls
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">Invoice Volume (Last 6 Months)</h2>

                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={invoiceVolume}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <defs>
                                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#B9E69E" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#B9E69E" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<VolumeTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#55548F"
                                    strokeWidth={2}
                                    fill="url(#colorVolume)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

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
        </div>
    </Master>
  )
}
