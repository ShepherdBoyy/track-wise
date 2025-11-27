import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PageWrapper from "./PageWrapper";
export default function Master({ children }) {
    return (
        <div className="drawer lg:drawer-open min-h-screen">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto bg-base-200 px-10 py-10 ">
                    <PageWrapper>{children}</PageWrapper>
                </main>
            </div>

            <Sidebar />
        </div>
    );
}
