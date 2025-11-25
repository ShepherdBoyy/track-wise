import { Form, usePage } from "@inertiajs/react";

export default function Index({ selectedInvoice }) {
    const currentUser = usePage().props.auth.user;

    return (
        <div className="p-8">
            <Form
                action={`/hospitals/invoices/${selectedInvoice.id}/history/store`}
                method="post"
                className="mb-10"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-col gap-2">
                        <label htmlFor="updated_by" className="text-sm">
                            Update By:
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full rounded-xl"
                            defaultValue={currentUser.name}
                            readOnly
                        />
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                        <label htmlFor="description" className="text-sm">
                            Description:
                        </label>
                        <select
                            defaultValue=""
                            className="select rounded-xl w-full"
                            name="description"
                            id="description"
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            <option>
                                Invoice remains open pending verification of the
                                submitted billing documents; awaiting
                                confirmation from the hospital's finance team
                            </option>
                            <option>
                                Payment is currently under review due to
                                discrepancies found in the itemized charges;
                                vendor has been notified for clarification
                            </option>
                            <option>
                                Processing is delayed because supporting
                                documents were incomplete; waiting for the
                                client to provide the missing requirements
                            </option>
                            <option>
                                Invoice cannot be closed yet as the payment
                                request has not been approved by the authorized
                                signatory
                            </option>
                            <option>
                                Status remains open while coordination with the
                                accounting department is ongoing to resolve
                                amount differences before final closure
                            </option>
                        </select>
                    </div>
                </div>
                <div className=" mt-5 flex justify-end">
                    <button className="btn btn-primary w-36 rounded-xl ">
                        Update
                    </button>
                </div>
            </Form>

            <div>
                <div className="overflow-x-auto rounded-xl border border-base-300 bg-base-100">
                    <table className="table table-md">
                        <thead className="bg-base-200 text-base-content/80 text-xs uppercase">
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
                                        selectedInvoice.updated_at
                                    ).toLocaleDateString("en-PH", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </td>
                                <td className="w-[200px]">
                                    {selectedInvoice.creator.name}
                                </td>
                                <td>
                                    {selectedInvoice.description ||
                                        "Invoice has been created"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
