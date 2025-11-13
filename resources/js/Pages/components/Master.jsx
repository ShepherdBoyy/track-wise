import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Master({ children }) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" defaultChecked />
            <div className="drawer-content">
                <Navbar />

                <main className="p-4">{children}</main>
            </div>
        
            <Sidebar />
        </div>
    );
}
