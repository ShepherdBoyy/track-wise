import { AlertCircle } from "lucide-react";

export default function ImportErrors({ import_errors }) {
    const getAttributeLabel = (attribute) => {
        const labels = {
            area: "Area",
            customer_no: "Customer No",
            customer_name: "Customer Name",
            invoice_no: "Invoice No",
            document_date: "Document Date",
            due_date: "Due Date",
            amount: "Amount",
        };
        return labels[attribute] || attribute;
    };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6 mb-4">
        <div className="flex gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={25} />
            <div className="flex-1">
                <p className="text-red-800 font-semibold text-lg mb-2">
                    Import Errors Found
                </p>
                <p className="text-red-700 text-sm mb-3">
                    Please fix the following errors in your file and try again:
                </p>
            </div>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
                <thead className="bg-white sticky top-0 rounded-lg">
                    <tr>
                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">Row</th>
                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">Field</th>
                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">Value</th>
                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">Error</th>
                    </tr>
                </thead>
                <tbody>
                    {import_errors?.map((error, index) => (
                        <tr key={index} className="border-b border-red-100">
                            <td className="px-4 py-3 text-red-800">{error.row}</td>
                            <td className="px-4 py-3 text-red-800">{getAttributeLabel(error.header)}</td>
                            <td className="px-4 py-3 text-red-800">{error.value}</td>
                            <td className="px-4 py-3 text-red-800">
                                {Array.isArray(error.errors)
                                    ? error.errors.join(", ")
                                    : error.errors}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}
