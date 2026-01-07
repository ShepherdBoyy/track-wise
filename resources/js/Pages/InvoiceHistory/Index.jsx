import Master from "../components/Master";
import { useState } from "react";
import { FileText } from "lucide-react";
import OpenInvoice from "./elements/OpenInvoice";
import ClosedInvoice from "./elements/ClosedInvoice";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Index({ invoice, history, editor, breadcrumbs }) {
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState("");

    const isClosed = invoice.status === "closed";

    return (
        <Master>
            <div className="bg-base-200">
                {showToast && (
                    <div className="toast toast-top toast-center">
                        <div className="alert alert-info">
                            <span>Updated Successfully</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-2 justify-between pb-4">
                    <Breadcrumbs items={breadcrumbs} />
                </div>
                <div className="flex flex-col bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between cursor-pointer items-center mb-4">
                        <span className="text-2xl">
                            {invoice.hospital.hospital_name}
                        </span>
                        <a
                            href={`/hospitals/${invoice.hospital.id}/invoices/${invoice.id}/history/download`}
                            target="_blank"
                            className="flex items-center btn gap-1 p-2 tooltip"
                            data-tip="View PDF"
                        >
                            <FileText />
                            <span>PDF</span>
                        </a>
                    </div>

                    {isClosed ? (
                        <ClosedInvoice invoice={invoice} history={history} />
                    ) : (
                        <OpenInvoice
                            invoice={invoice}
                            history={history}
                            editor={editor}
                            error={error}
                            setError={setError}
                            setShowToast={setShowToast}
                        />
                    )}
                </div>
            </div>
        </Master>
    );
}
