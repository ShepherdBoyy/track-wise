import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Master({ children }) {
    return (
        <div className="drawer lg:drawer-open min-h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto bg-base-200 p-8">
                    {children}
                </main>
            </div>

            <Sidebar />
        </div>
    );
}
