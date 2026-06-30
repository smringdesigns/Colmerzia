import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function DashboardLayout() {
    return (
        <div
            style={{
                display: "flex",
                background: "#F8FAFC",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    minHeight: "100vh",
                }}
            >
                <Header />

                <main
                    style={{
                        padding: 24,
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}