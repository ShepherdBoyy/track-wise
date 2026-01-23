import { FileText } from "lucide-react";
import React from "react";

export default function HistoryTable({ history, invoice }) {
    return (
        <div className="col-span-3 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
            <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl flex justify-between items-center">
                <span>History</span>
                <a
                    href={`/hospitals/${invoice.hospital.id}/invoices/${invoice.id}/history/download`}
                    target="_blank"
                    className="flex items-center tooltip tooltip-left flex gap-1 z-50"
                    data-tip="View PDF"
                >
                    <FileText />
                </a>
            </div>
            <div className="p-4">
                <table className="table table-md">
                    <thead>
                        <tr>
                            <th>Updated At</th>
                            <th>Updated By</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={index}>
                                <td className="w-[150px]">
                                    {new Date(
                                        item.created_at,
                                    ).toLocaleDateString()}
                                </td>
                                <td className="w-[250px]">
                                    {item.updater.name}
                                </td>
                                <td>{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
