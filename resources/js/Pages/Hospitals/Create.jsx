import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ setOpen }) {
    const [error, setError] = useState("");

    console.log(error)

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg text-center">Add Hospital</h3>

                <Form
                    action="/hospitals/create"
                    method="post"
                    onError={(error) => setError(error.hospital_name)}
                >
                    <div className="flex flex-col gap-2 mt-3">
                        <div className="flex justify-between">
                            <label htmlFor="hospital_name">Hospital Name:</label>
                            {error && (
                                <span className="text-destructive text-sm">{error}</span>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input w-full"
                            name="hospital_name"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="btn bg-gray-800 text-white"
                        >
                            Submit
                        </button>
                    </div>
                </Form>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpen(false)}
            />
        </dialog>
    );
}
