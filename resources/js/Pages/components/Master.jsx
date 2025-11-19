import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Master({ children }) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <Navbar />

                <main>{children}</main>
            </div>

            <Sidebar />
        </div>
    );
}
