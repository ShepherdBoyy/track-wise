import { FileText } from 'lucide-react'

export default function Show({ invoice, setSelectedInvoice, setOpenHistoryModal }) {

  return (
    <dialog open className="modal">
        <div className="modal-box max-w-4xl">
            <div className="p-6 bg-linear-to-br from-primary/10 to-base-200 border-b border-base-300 rounded-t-xl flex justify-between items-center">
                <span>History</span>
                <a
                    href={`/hospitals/${invoice.hospital.id}/invoices/${invoice.id}/view-history`}
                    target="_blank"
                    className="flex items-center tooltip tooltip-left flex gap-1 z-50"
                    data-tip="View PDF"
                >
                    <FileText />
                </a>
            </div>
            <div className="p-4">
                <table className="table table-md">
                    <thead>
                        <tr>
                            <th className='w-[120px]'>Updated At</th>
                            <th className='w-[200px]'>Updated By</th>
                            <th className='w-[800px]'>Remarks</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.history.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {new Date(
                                        item.created_at,
                                    ).toLocaleDateString()}
                                </td>
                                <td>
                                    {item.updater.name}
                                </td>
                                <td>{item.remarks}</td>
                                <td>
                                    <span
                                        className={`badge badge-md text-sm rounded-full ${
                                            item.status === "closed"
                                                ? "bg-emerald-100 text-emerald-700 border-green-600"
                                                : item.status === "open"
                                                    ? "bg-yellow-100 text-yellow-700 border-yellow-600"
                                                    : item.status === "overdue"
                                                    ? "bg-red-100 text-red-700 border-red-600"
                                                    : "badge-neutral"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => {
                setOpenHistoryModal(false);
                setSelectedInvoice(null);
            }}
        />
    </dialog>
  )
}
