import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Edit({
    setOpenEditModal,
    hospital,
    setShowToast,
    setSuccessMessage,
    areas,
}) {
    const [error, setError] = useState("");
    const [hospitalName, setHospitalName] = useState(
        hospital.hospital_name || ""
    );

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Edit Hospital</h3>

                <Form
                    action={`/hospitals/edit/${hospital.id}`}
                    method="put"
                    onError={(error) => setError(error)}
                    onSuccess={() => {
                        setOpenEditModal(false);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                        setSuccessMessage(
                            `${hospitalName} updated successfully`
                        );
                    }}
                >
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="area_id" className="text-sm">
                                Area
                            </label>
                            {error.area_id && (
                                <span className="text-red-500 text-sm">
                                    {error.area_id}
                                </span>
                            )}
                        </div>
                        <select
                            defaultValue={hospital.area.area_name}
                            className="select w-full"
                            name="area_id"
                            id="area_id"
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.area_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 mt-8">
                        <div className="flex justify-between">
                            <label
                                htmlFor="hospital_number"
                                className="text-sm"
                            >
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
                            defaultValue={hospital.hospital_number}
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-8">
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
                            defaultValue={hospital.hospital_name}
                            onChange={(e) => setHospitalName(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end mt-6 gap-2">
                        <button
                            className="btn btn-outline rounded-xl"
                            onClick={() => {
                                setOpenEditModal(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn bg-gray-800 text-white rounded-xl"
                        >
                            Confirm
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenEditModal(false)}
            />
        </dialog>
    );
}
