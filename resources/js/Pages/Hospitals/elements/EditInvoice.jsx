import Master from "../../components/Master";

export default function EditInvoice({ invoice }) {
    console.log(invoice);

    return (
        <>
            <Master>
                <div className="p-8 bg-base-200 ">
                    <div className="flex flex-col bg-white p-6 rounded-xl">
                        <span className="text-2xl mb-4">
                            {invoice.hospital.hospital_name}
                        </span>
                        <div className="grid grid-cols-3 auto-rows-min gap-4">
                            <div className="row-span-1 border rounded-xl border-gray-300">
                                <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    {invoice.invoice_number}
                                </div>
                                <div className="grid grid-cols-2 gap-y-8 p-6">
                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Issued by
                                        </p>
                                        <p className="text-md">
                                            {invoice.creator.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Created At
                                        </p>
                                        <p className="text-md">
                                            {new Date(
                                                invoice.creator.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Hospital
                                        </p>
                                        <p className="text-md">
                                            {invoice.hospital.hospital_name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Status
                                        </p>
                                        <span className="badge badge-lg bg-green-100 text-green-700">
                                            {invoice.status}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Document Date
                                        </p>
                                        <p className="text-md">
                                            {new Date(
                                                invoice.document_date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm opacity-60 mb-1">
                                            Amount
                                        </p>
                                        <p className="text-md">
                                            ₱
                                            {parseFloat(
                                                invoice.amount
                                            ).toLocaleString("en-PH", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                                <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    Update Invoice
                                </div>
                                <div className="p-6"></div>
                            </div>

                            <div className="col-span-3 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                                <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    Update History
                                </div>
                                <div className="p-4">
                                    <table className="table table-md">
                                        <thead className="">
                                            <tr>
                                                <th>Updated At</th>
                                                <th>Updated By</th>
                                                <th>Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="w-[150px]">
                                                    {new Date(
                                                        invoice.updated_at
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="w-[200px]">
                                                    Dorothy Heaney
                                                </td>
                                                <td>
                                                    Ipsam aspernatur et ratione
                                                    ullam. Libero consequatur
                                                    maiores dicta unde.
                                                    Consequatur perferendis
                                                    voluptatem omnis ab deleniti
                                                    quia. Dicta fuga nostrum
                                                    nisi.
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Master>
        </>
    );
}
