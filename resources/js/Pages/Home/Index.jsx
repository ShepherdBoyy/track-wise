import {
    CalendarX2,
    ChevronDown,
    DollarSign,
    ExternalLink,
    FileText,
    Minus,
    TrendingDown,
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
import KpiCards from "./elements/KpiCards"
import SummaryAndTopAreas from "./elements/SummaryAndTopAreas";
import InvoiceMonthlyOutstandingAndVolume from "./elements/InvoiceMonthlyOutstandingAndVolume";
import TopTenHospitals from "./elements/TopTenHospitals";

export default function Index({
    kpi,
    agingBreakdown,
    topAreas,
    topHospitals,
    monthlyOutstanding,
    invoiceVolume
}) {
    

  return (
    <Master>
        <div className="bg-base-200 space-y-6">
            <div className="mb-4">
                <span className="text-2xl">Dashboard</span>
            </div>

            <KpiCards kpi={kpi} />

            <SummaryAndTopAreas agingBreakdown={agingBreakdown} topAreas={topAreas} />

            <InvoiceMonthlyOutstandingAndVolume monthlyOutstanding={monthlyOutstanding} invoiceVolume={invoiceVolume} />

            <TopTenHospitals topHospitals={topHospitals} />
        </div>
    </Master>
  )
}
