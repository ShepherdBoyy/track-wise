import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function SummaryAndTopAreas({ agingBreakdown, topAreas }) {
    const AgingTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-base-100 p-4 rounded-lg shadow-xl border border-base-300">
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
                    <p className="text-sm">{data.value.toLocaleString()} invoices</p>
                </div>
            )
        }
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card bg-base-100 shadow-lg">
            <div className="card-body">
                <h2 className="text-lg font-bold mb-3">Invoice Aging Summary</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={agingBreakdown}
                        margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                        <XAxis 
                            dataKey="category"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={window.innerWidth < 640 ? -45 : 0}
                            textAnchor={window.innerWidth < 640 ? "end" : "middle"}
                            height={window.innerWidth < 640 ? 60 : 30}
                        />
                        <YAxis 
                            yAxisId="left"
                            orientation="left"
                            tickFormatter={(value) => {
                                if (window.innerWidth < 640) {
                                    return `₱${(value / 1000000).toFixed(0)}M`;
                                }
                                return `₱${(value / 1000000).toFixed(1)}M`;
                            }}
                            tick={{ fontSize: 11 }}
                            width={45}
                        />
                        <YAxis 
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12 }}
                            width={35}
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
                <h2 className="text-lg font-bold mb-3">Top 5 High-Volume Areas</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={topAreas}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={window.innerWidth < 640 ? 70 : 90}
                        />
                        <Tooltip content={<DonutTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                            formatter={(value, entry) => (
                                <span className="text-xs">{entry.payload.name} ({entry.payload.percentage})</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  )
}
