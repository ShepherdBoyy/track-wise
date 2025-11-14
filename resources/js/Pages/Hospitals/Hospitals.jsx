import { router } from "@inertiajs/react";
import Master from "../components/Master";

export default function Hospitals({ hospitals }) {

    return (
        <Master>
            <div className="p-6">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 ">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Hospital Name</th>
                                <th>Number of Invoices</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map((hospital, index) => (
                                <tr
                                    key={hospital.id}
                                    className="hover:bg-base-300 cursor-pointer"
                                    onClick={() =>
                                        router.get(`/invoices`, {
                                            hospital_id: hospital.id,
                                            processing_days: "0-30 days"
                                        })
                                    }
                                >
                                    <td>{index + 1}</td>
                                    <td>{hospital.hospital_name}</td>
                                    <td>{hospital.invoices_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Master>
    );
}
