import { useState } from "react";
import { Building2, Settings as SettingsIcon, Users } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import { useAuthStore } from "../store/authStore";
import PlatformStoresTab from "../features/platform/components/PlatformStoresTab";
import PlatformUsersTab from "../features/platform/components/PlatformUsersTab";

type PlatformTabKey = "stores" | "users";

export default function PlatformStores() {
    const { hasRole } = useAuthStore();
    const isSuperAdmin = hasRole("super-admin");

    const tabs: { key: PlatformTabKey; label: string; icon: typeof Building2 }[] = [
        { key: "stores", label: "Tiendas", icon: Building2 },
        { key: "users", label: "Usuarios", icon: Users },
    ];

    const [activeTab, setActiveTab] = useState<PlatformTabKey>("stores");

    if (!isSuperAdmin) {
        return (
            <div className="resource-page">
                <PageHeader
                    eyebrow="Plataforma"
                    title="Todas las tiendas"
                    subtitle="No tienes permisos para acceder a esta sección."
                />
            </div>
        );
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Plataforma"
                title="Todas las tiendas"
                subtitle="Administra todas las tiendas y usuarios de Colmerzia desde un solo lugar."
                action={
                    <span className="ui-badge purple">
                        <SettingsIcon size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                        Super-admin
                    </span>
                }
            />

            <nav className="settings-tabs">
                {tabs.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        type="button"
                        className={`settings-tab ${activeTab === key ? "active" : ""}`}
                        onClick={() => setActiveTab(key)}
                    >
                        <Icon size={16} />
                        {label}
                    </button>
                ))}
            </nav>

            {activeTab === "stores" && <PlatformStoresTab />}
            {activeTab === "users" && <PlatformUsersTab />}
        </div>
    );
}
