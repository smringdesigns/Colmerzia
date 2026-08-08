import { useState } from "react";
import { Settings as SettingsIcon, Shield, Store, Users } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import { useAuthStore } from "../store/authStore";
import GeneralSettingsTab from "../features/settings/components/GeneralSettingsTab";
import UsersTab from "../features/settings/components/UsersTab";
import RolesTab from "../features/settings/components/RolesTab";

type SettingsTabKey = "general" | "users" | "roles";

export default function Settings() {
    const hasPermission = useAuthStore((state) => state.hasPermission);

    const tabs: { key: SettingsTabKey; label: string; icon: typeof Store; visible: boolean }[] = [
        { key: "general", label: "General", icon: Store, visible: hasPermission("settings.view") },
        { key: "users", label: "Usuarios", icon: Users, visible: hasPermission("users.view") },
        { key: "roles", label: "Roles y permisos", icon: Shield, visible: hasPermission("roles.view") },
    ];

    const visibleTabs = tabs.filter((tab) => tab.visible);

    const [activeTab, setActiveTab] = useState<SettingsTabKey>(
        visibleTabs[0]?.key ?? "general"
    );

    if (visibleTabs.length === 0) {
        return (
            <div className="resource-page">
                <PageHeader
                    eyebrow="Panel"
                    title="Configuración"
                    subtitle="No tienes permisos para acceder a esta sección."
                />
            </div>
        );
    }

    return (
        <div className="resource-page">
            <PageHeader
                eyebrow="Panel"
                title="Configuración"
                subtitle="Administra tu tienda, tu equipo y sus permisos."
                action={
                    <span className="ui-badge purple">
                        <SettingsIcon size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
                        Espacio de trabajo
                    </span>
                }
            />

            <nav className="settings-tabs">
                {visibleTabs.map(({ key, label, icon: Icon }) => (
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

            {activeTab === "general" && hasPermission("settings.view") && <GeneralSettingsTab />}
            {activeTab === "users" && hasPermission("users.view") && <UsersTab />}
            {activeTab === "roles" && hasPermission("roles.view") && <RolesTab />}
        </div>
    );
}
