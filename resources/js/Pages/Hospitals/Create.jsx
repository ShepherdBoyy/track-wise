import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ setOpenCreateModal, setShowToast, setSuccessMessage, areas }) {
    const [error, setError] = useState("");
    const [hospitalName, setHospitalName] = useState("");

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Add Hospital</h3>
                <p className="text-sm text-gray-500 text-center">
                    Input a new hospital to register it to our server
                </p>

                <Form
                    action="/hospitals/create"
                    method="post"
                    onError={(error) => setError(error)}
                    onSuccess={() => {
                        setOpenCreateModal(false);
                        setShowToast(true);
                        setSuccessMessage(`${hospitalName} added successfully`);
                        setTimeout(() => setShowToast(false), 3000);
                    }}
                >
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="area_id" className="text-sm">Area:</label>
                            {error.area_id && (
                                <span className="text-red-500 text-sm">
                                    {error.area_id}
                                </span>
                            )}
                        </div>
                        <select
                            defaultValue=""
                            className="select w-full"
                            name="area_id"
                            id="area_id"
                        >
                            <option value="" disabled>Select</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.area_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="hospital_number" className="text-sm">
                                Hospital No.
                            </label>
                            {error.hospital_number && (
                                <span className="text-red-500 text-sm">
                                    {error.hospital_number}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="hospital_number"
                        />
                    </div>

                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="hospital_name" className="text-sm">
                                Hospital Name
                            </label>
                            {error.hospital_name && (
                                <span className="text-red-500 text-sm">
                                    {error.hospital_name}
                                </span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="hospital_name"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1 mt-8">
                            <div className="flex justify-between">
                                <label htmlFor="credit_terms" className="text-sm">
                                    Credit Terms
                                </label>
                                {error.credit_terms && (
                                    <span className="text-red-500 text-sm">
                                        {error.credit_terms}
                                    </span>
                                )}
                            </div>
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input w-full"
                                name="credit_terms"
                            />
                        </div>

                        <div className="flex flex-col gap-1 mt-8">
                            <div className="flex justify-between">
                                <label htmlFor="credit_limit" className="text-sm">
                                    Credit Limit
                                </label>
                                {error.credit_limit && (
                                    <span className="text-red-500 text-sm">
                                        {error.credit_limit}
                                    </span>
                                )}
                            </div>
                            <input
                                type="number"
                                placeholder="Type here"
                                className="input w-full"
                                name="credit_limit"
                            />
                        </div>
                    </div>
                    

                    <div className="flex justify-end mt-6 gap-2">
                        <button className="btn btn-outline rounded-xl" onClick={() => setOpenCreateModal(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn bg-gray-800 text-white rounded-xl">
                            Confirm
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenCreateModal(false)}
            />
        </dialog>
    );
}
