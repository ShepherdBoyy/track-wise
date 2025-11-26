import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { Link, router } from "@inertiajs/react";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";

export default function Index({ invoices, searchQuery, processingFilter }) {
    const [search, setSearch] = useState(searchQuery || "");
    const [active, setActive] = useState(processingFilter);

    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim() !== "") {
            router.get(
                `/invoices/${processingFilter}`,
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    const processingDays = [
        { label: "Current" },
        { label: "30 days" },
        { label: "31-60 days" },
        { label: "61-90 days" },
        { label: "91-over" },
        { label: "Closed" },
    ];

    return (
        <Master>
            <div className="bg-base-200 ">
                <div className="p-6">
                    <span className="text-2xl">Invoices</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4 gap-2 ">
                        <div className="flex items-center gap-x-3">
                            <span className="text-2xl">All Invoices</span>
                        </div>
                        <div className="flex items-center gap-x-2 ">
                            <fieldset className="fieldset w-36 ">
                                <select
                                    defaultValue=""
                                    className="select rounded-xl"
                                    onChange={(e) => {
                                        const label = e.target.value;
                                        router.get(
                                            `/invoices/${label.replace(
                                                / /g,
                                                "-"
                                            )}`,
                                            {},
                                            {
                                                preserveState: true,
                                                preserveScroll: true,
                                            }
                                        );
                                    }}
                                >
                                    <option disabled value="">
                                        Filter By Days
                                    </option>
                                    {processingDays.map((day, index) => (
                                        <option key={index}>{day.label}</option>
                                    ))}
                                </select>
                            </fieldset>
                            <div className="flex justify-content-end">
                                <SearchIt
                                    search={search}
                                    setSearch={setSearch}
                                    name="Invoice No."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 pt-5">
                        <table className="table  table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-[100px]">#</th>
                                    <th>Invoice No.</th>
                                    <th>Hospital Name</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoices.data.map((invoice, index) => (
                                    <tr key={invoice.id}>
                                        <td>{index + 1}</td>
                                        <td>{invoice.invoice_number}</td>
                                        <td>
                                            <Link
                                                href={`/hospitals/${invoice.hospital.id}/invoices/all`}
                                                className="hover:underline"
                                            >
                                                {invoice.hospital.hospital_name}
                                            </Link>
                                        </td>
                                        <td>
                                            {new Date(
                                                invoice.due_date
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="text-left">
                                            <span
                                                className={`badge badge-md text-sm rounded-full ${
                                                    invoice.status.toLowerCase() ===
                                                    "closed"
                                                        ? "bg-emerald-100 text-emerald-700 border-green-600"
                                                        : invoice.status.toLowerCase() ===
                                                          "open"
                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                                        : invoice.status.toLowerCase() ===
                                                          "overdue"
                                                        ? "bg-red-100 text-red-700 border-red-600"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination data={invoices} />
                </div>
            </div>
        </Master>
    );
}
