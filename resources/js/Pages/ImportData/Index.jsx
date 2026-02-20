import { CloudUpload, X } from "lucide-react";
import Master from "../components/Master";
import { router, usePage } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import ExcelFormat from "./elements/ExcelFormat";
import ImportErrors from "./elements/ImportErrors";
import ImportHistory from "./elements/ImportHistory";

export default function Index({ importHistory }) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const dragCounter = useRef(0);

    const { import_errors, success, permissions } = usePage().props;
    const importErrors = import_errors || [];

    console.log(importErrors);

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
                    onProgress: (progressEvent) => setProgress(progressEvent.percentage),
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

                {importErrors.length > 0 && (
                    <ImportErrors import_errors={import_errors} />
                )}

                <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row gap-5">
                        <ExcelFormat />

                        <div className="w-full lg:w-1/2 mx-auto">
                            <span className="text-md block text-center font-semibold mb-3">Upload</span>
                            <div
                                className={`relative bg-white border-2
                                    ${dragActive ? "border-blue-500" : "border-gray-300"}
                                    border-dashed rounded-md p-4 min-h-[300px] flex flex-col items-center justify-center transition-colors`}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {dragActive && (
                                    <div className="absolute inset-0 bg-gray-300 bg-opacity-30 rounded-md flex items-center justify-center z-10 pointer-events-none">
                                        <p className="text-white text-2xl font-bold">Drop here</p>
                                    </div>
                                )}

                                {uploading ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div
                                            className="radial-progress text-blue-600"
                                            style={{ "--value": progress || 0, "--size": "5rem" }}
                                            role="progressbar"
                                        >
                                            {Math.round(progress) || 0}%
                                        </div>
                                        <p className="text-slate-600 font-semibold">Uploading...</p>
                                    </div>
                                ) : (
                                    <>
                                        <CloudUpload size={34} className="text-slate-600 mb-2" />
                                        <h4 className="text-base font-semibold text-slate-600">Drag & Drop file here</h4>
                                        <span className="block my-2 text-slate-500">Or</span>
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
                                            disabled={!permissions.canManageImportData}
                                        />
                                        {fileName && (
                                            <div className="flex items-center gap-2">
                                                <p className="mt-4 text-sm text-slate-600">
                                                    Selected:{" "}
                                                    <span className="font-semibold">{fileName}</span>
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

                <ImportHistory importHistory={importHistory} />
            </div>
        </Master>
    );
}
