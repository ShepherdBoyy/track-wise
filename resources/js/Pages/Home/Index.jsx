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
import { Link, router, usePage } from "@inertiajs/react";
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
    const { user } = usePage().props.auth;

    const today = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

  return (
    <Master>
        <div className="bg-base-200 space-y-6">
            <div className="flex flex-col py-6 gap-2">
                <span className="text-md font-medium opacity-70" >{today.toLocaleDateString(undefined, options)}</span>
                <span className="text-5xl font-normal">
                    Welcome Back, {user.name.trim().split(" ").length > 1
                        ? user.name.trim().split(" ")[0]
                        : user.name}!
                    </span>
            </div>

            <KpiCards kpi={kpi} />

            <SummaryAndTopAreas agingBreakdown={agingBreakdown} topAreas={topAreas} />

            <InvoiceMonthlyOutstandingAndVolume monthlyOutstanding={monthlyOutstanding} invoiceVolume={invoiceVolume} />

            <TopTenHospitals topHospitals={topHospitals} />
        </div>
    </Master>
  )
}
