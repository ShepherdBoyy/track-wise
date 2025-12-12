import { router } from "@inertiajs/react";

export default function DeleteHospitalModal({
    setOpenDeleteModal,
    hospital,
    setShowToast,
    setSuccessMessage,
}) {
    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-2">Are you absolutely sure?</h3>
                <p className="text-sm text-gray-500">
                    This action cannot be undone. This will permanently delete
                    the agent's information and remove the data from our server.
                </p>

                <div className="flex justify-end mt-5">
                    <button
                        className="btn btn-outline mr-2 rounded-xl"
                        onClick={() => setOpenDeleteModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-red-600 text-white hover:bg-red-800 rounded-xl"
                        onClick={() =>
                            router.delete(`/hospitals/delete/${hospital.id}`, {
                                onSuccess: () => {
                                    setOpenDeleteModal(false);
                                    setShowToast(true);
                                    setTimeout(() => setShowToast(false), 3000);
                                    setSuccessMessage(
                                        `${hospital.hospital_name} deleted successfully`
                                    );
                                },
                            })
                        }
                    >
                        Confirm
                    </button>
                </div>
            </div>

            <form
                method="dialog"
                className="modal-backdrop"
                onClick={() => setOpenDeleteModal(false)}
            />
        </dialog>
    );
}
