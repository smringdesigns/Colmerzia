export default function ComingSoon({ title }: { title: string }) {
    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <h1 style={{ margin: 0, fontSize: 22, color: "#0F1117" }}>{title}</h1>
            <p style={{ marginTop: 8, color: "#6B7280" }}>
                Esta sección está lista para conectarse cuando avancemos con el módulo.
            </p>
        </div>
    );
}
