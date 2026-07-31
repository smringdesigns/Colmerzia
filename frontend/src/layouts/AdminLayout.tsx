import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AdminLayout() {
    return (
        <div className="admin-shell">
            <Sidebar />

            <div className="admin-content">
                <Header />

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
