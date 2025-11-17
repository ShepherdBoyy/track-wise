import { Form } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ setOpen }) {
    const [error, setError] = useState("");

    console.log(error);

    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Add Hospital</h3>
                <p className="text-sm text-gray-500">
                    Input a new hospital to register it to our server
                </p>

                <Form
                    action="/hospitals/create"
                    method="post"
                    onError={(error) => setError(error.hospital_name)}
                >
                    <div className="flex flex-col gap-1 mt-8">
                        <div className="flex justify-between">
                            <label htmlFor="hospital_name" className="text-sm">
                                Hospital Name
                            </label>
                            {error && (
                                <span className="text-red-500 text-sm">
                                    {error}
                                </span>
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
                            className="btn bg-gray-800 text-white rounded-xl w-30"
                        >
                            Confirm
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
