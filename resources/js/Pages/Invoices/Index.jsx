import { useEffect, useState } from "react";
import Master from "../components/Master";
import SearchIt from "../components/SearchIt";
import { Link, router } from "@inertiajs/react";
import Pagination from "../components/Pagination";
import useDebounce from "../hooks/useDebounce";
import { motion } from "motion/react";

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
                <div className="flex items-center justify-between pb-4">
                    <span className="text-2xl">Invoices</span>
                    <SearchIt
                        search={search}
                        setSearch={setSearch}
                        name="Invoice No."
                    />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4  ">
                        <span className="text-xl">All Invoices</span>

                        <div className="flex ">
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
                            <div className="flex justify-content-end"></div>
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
                                    <motion.tr
                                        key={invoice.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: index * 0.05,
                                        }}
                                    >
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
                                    </motion.tr>
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
