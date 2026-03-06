import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function InvoiceMonthlyOutstandingAndVolume({ monthlyOutstanding, invoiceVolume }) {
    const [selectedYear, setSelectedYear] = useState(monthlyOutstanding.currentYear);
    
    const handleYearChange = (year) => {
        setSelectedYear(year);
        router.get("/",
            { year },
            { preserveScroll: true, preserveState: true }
        )
    }

    const OutstandingTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
                    <p className="text-sm">Amount:{" "} 
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
                    <p className="text-sm">Count: {data.count.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    }
    

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-7">
                    <h2 className="text-lg font-bold">Monthly Outstanding Trend</h2>
                    
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-sm btn-ghost gap-2">
                            {selectedYear}
                            <ChevronDown size={15} />
                        </label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24">
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
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                        <YAxis
                            tickFormatter={(value) => {
                                if (window.innerWidth < 640) {
                                    return `₱${(value / 1000000).toFixed(0)}M`;
                                }
                                return `₱${(value / 1000000).toFixed(1)}M`;
                            }}
                            tick={{ fontSize: 12 }}
                            width={45}
                        />
                        <Tooltip content={<OutstandingTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#55548F"
                            strokeWidth={3}
                            dot={{ fill: '#55548F', r: 3 }}
                            activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <div className="mb-3">
                    <h2 className="text-lg font-bold">Invoice Volume</h2>
                    <p className="text-xs opacity-50 mt-1">Last 6 months</p>
                </div>
                

                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={invoiceVolume}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#B9E69E" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#B9E69E" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} width={35} />
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
  )
}
