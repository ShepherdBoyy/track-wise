import { router } from "@inertiajs/react";

export default function DeleteInvoiceModal({
    setOpenDeleteModal,
    hospital,
    setShowToast,
    setSuccessMessage,
    selectedIds,
    setSelectedIds,
    setIsDeleteMode,
    setError
}) {
    return (
        <dialog open className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-2">
                    Are you absolutely sure?
                </h3>
                <p className="text-sm text-gray-500">
                    This action cannot be undone. This will permanently delete
                    the agent's information and remove the data from our server.
                </p>

                <div className="flex justify-end mt-5">
                    <button
                        className="btn btn-outline mr-2"
                        onClick={() => setOpenDeleteModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn bg-red-600 text-white hover:bg-red-800"
                        onClick={() => {
                            router.post(
                                `/hospitals/${hospital.id}/invoices/delete`,
                                { ids: selectedIds },
                                {
                                    onSuccess: () => {
                                        setIsDeleteMode(false);
                                        setSelectedIds([]);
                                        setOpenDeleteModal(false)
                                        setShowToast(true);
                                        setSuccessMessage(
                                            "Successfully Deleted"
                                        );
                                        setTimeout(
                                            () => setShowToast(false),
                                            3000
                                        );
                                    },
                                    onError: (error) => {
                                        setError(error);
                                    },
                                }
                            );
                        }}
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
