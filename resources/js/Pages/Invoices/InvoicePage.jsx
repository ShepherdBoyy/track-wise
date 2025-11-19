import Master from "../components/Master";

export default function InvoicePage({}) {
    return (
        <>
            <Master>
                <div className="px-10 py-8 bg-base-200 min-h-screen">
                    <div className="flex flex-col bg-white p-6 rounded-xl">
                        <span className="text-2xl mb-4">Lesch and Sons</span>
                        <div class="grid grid-cols-3 auto-rows-min gap-4">
                            <div class="row-span-1 border rounded-xl border-gray-300">
                                <div class="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    INV-432381
                                </div>
                                <div class="grid grid-cols-2 gap-y-8 p-6">
                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Issued by
                                        </p>
                                        <p class="text-md">Dorothy Heaney</p>
                                    </div>

                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Created At
                                        </p>
                                        <p class="text-md">Nov 17, 2025</p>
                                    </div>

                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Hospital
                                        </p>
                                        <p class="text-md">Emard-Wolff</p>
                                    </div>

                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Status
                                        </p>
                                        <span class="badge badge-lg bg-green-100 text-green-700">
                                            Closed
                                        </span>
                                    </div>

                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Transaction Date
                                        </p>
                                        <p class="text-md">Jul 29, 2025</p>
                                    </div>

                                    <div>
                                        <p class="text-sm opacity-60 mb-1">
                                            Amount
                                        </p>
                                        <p class="text-md">₱11,605.13</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-span-2 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                                <div class="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    Update Invoice
                                </div>
                                <div class="p-6"></div>
                            </div>

                            <div class="col-span-3 border rounded-xl border-gray-300 min-h-[300px] overflow-auto">
                                <div class="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl">
                                    Update History
                                </div>
                                <div class="p-4">
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
                                                    Nov 17, 2025
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
