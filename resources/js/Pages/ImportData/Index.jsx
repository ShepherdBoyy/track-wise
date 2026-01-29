import { AlertCircle, CloudUpload, X } from "lucide-react";
import Master from "../components/Master";
import { sampleData } from "./elements/sampleData";
import { router, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";

export default function Index() {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const dragCounter = useRef(0);

    const { import_errors, success, permissions } = usePage().props;
    const importErrors = import_errors || [];

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(true);
        }
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        dragCounter.current = 0;

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            setFileName(files[0].name);
            setFile(files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (file) {
            setUploading(true);

            router.post(
                "/import-data/store",
                { file: file },
                {
                    forceFormData: true,
                    onProgress: (progressEvent) => {
                        setProgress(progressEvent.percentage);
                    },
                    onError: () => {
                        setUploading(false);
                        setProgress(0);
                    },
                },
            );
        }
    };

    useEffect(() => {
        if (success) {
            setUploading(false);
            setProgress(0);
            setFile(null);
            setFileName("");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else if (importErrors.length > 0) {
            setUploading(false);
            setProgress(0);
        }
    }, [success, importErrors]);

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
        <Master>
            <div className="bg-base-200">
                {showToast && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-info">
                            <span>Import Successful</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between pb-4">
                    <span className="text-2xl">Import New Data</span>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6">
                    <div className="flex gap-5">
                        <div className="w-2/3 flex flex-col justify-between">
                            <div>
                                <span className="text-md block text-center font-semibold mb-3">
                                    Sample Excel Format
                                </span>

                                <table className="table table-auto w-full border border-base-content/20">
                                    <thead>
                                        <tr className="bg-base-200 text-base-content">
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Area
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Customer No.
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Customer Name
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Invoice No.
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Document Date
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Due Date
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Closed Date
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Days Overdue
                                            </th>
                                            <th className="border border-base-content/20 text-center p-2 font-normal">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sampleData.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.area}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.customer_no}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.customer_name}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.invoice_number}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.document_date}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.due_date}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.closed_date}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.days_overdue}
                                                </td>
                                                <td className="border border-base-content/20 text-center p-2 whitespace-normal">
                                                    {item.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button
                                    className="btn shadow-md rounded-xl"
                                    onClick={() =>
                                        (window.location.href =
                                            "/import-data/download-template")
                                    }
                                >
                                    Download
                                </button>
                                <span>
                                    Download template as starting point for your
                                    own file.
                                </span>
                            </div>
                        </div>

                        <div className="w-1/2 mx-auto">
                            <span className="text-md block text-center font-semibold mb-3">
                                Upload
                            </span>
                            <div
                                className={`relative bg-white border-2 
                                    ${
                                        dragActive
                                            ? "border-blue-500"
                                            : "border-gray-300"
                                    } border-dashed rounded-md p-4 min-h-[300px] flex flex-col items-center justify-center transition-colors`}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {dragActive && (
                                    <div className="absolute inset-0 bg-gray-300 bg-opacity-30 rounded-md flex items-center justify-center z-10 pointer-events-none">
                                        <p className="text-white text-2xl font-bold">
                                            Drop here
                                        </p>
                                    </div>
                                )}

                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div
                                            className="radial-progress text-blue-600"
                                            style={{
                                                "--value": progress || 0,
                                                "--size": "5rem",
                                            }}
                                            role="progressbar"
                                        >
                                            {Math.round(progress) || 0}%
                                        </div>
                                        <p className="text-slate-600 font-semibold">
                                            Uploading...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <CloudUpload
                                            size={34}
                                            className="text-slate-600 mb-2"
                                        />
                                        <h4 className="text-base font-semibold text-slate-600">
                                            Drag & Drop file here
                                        </h4>
                                        <span className="block my-2 text-slate-500">
                                            Or
                                        </span>
                                        <label
                                            htmlFor="chooseFile"
                                            className={`text-blue-600 text-base font-semibold ${permissions.canManageImportData ? "cursor-pointer" : "cursor-not-allowed"}`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Choose file
                                        </label>
                                        <input
                                            type="file"
                                            id="chooseFile"
                                            className="hidden"
                                            onChange={handleChange}
                                            accept=".xlsx"
                                            disabled={
                                                !permissions.canManageImportData
                                            }
                                        />
                                        {fileName && (
                                            <div className="flex items-center gap-2">
                                                <p className="mt-4 text-sm text-slate-600">
                                                    Selected:{" "}
                                                    <span className="font-semibold">
                                                        {fileName}
                                                    </span>
                                                </p>
                                                <X
                                                    size={18}
                                                    className="bg-gray-300 rounded-lg p-0.5 cursor-pointer hover:bg-gray-400"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFileName("");
                                                        setFile(null);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!file && !uploading}
                                    className="btn btn-primary w-full rounded-xl"
                                >
                                    Import
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {importErrors.length > 0 && (
                    <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6 mt-4">
                        <div className="flex gap-2">
                            <AlertCircle
                                className="text-red-600 flex-shrink-0 mt-0.5"
                                size={25}
                            />
                            <div className="flex-1">
                                <p className="text-red-800 font-semibold text-lg mb-2">
                                    Import Errors Found
                                </p>
                                <p className="text-red-700 text-sm mb-3">
                                    Please fix the following errors in your file
                                    and try again:
                                </p>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white sticky top-0 rounded-lg">
                                    <tr>
                                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">
                                            Row
                                        </th>
                                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">
                                            Field
                                        </th>
                                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">
                                            Value
                                        </th>
                                        <th className="px-4 py-2 text-red-800 text-left font-semibold border-b border-red-200">
                                            Error
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {import_errors?.map((error, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-red-100"
                                        >
                                            <td className="px-4 py-3 text-red-800">
                                                {error.row}
                                            </td>
                                            <td className="px-4 py-3 text-red-800">
                                                {getAttributeLabel(
                                                    error.header,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-red-800">
                                                {error.value}
                                            </td>
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
                )}
            </div>
        </Master>
    );
}
