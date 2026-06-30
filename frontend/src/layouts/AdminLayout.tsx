import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <Header />

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}