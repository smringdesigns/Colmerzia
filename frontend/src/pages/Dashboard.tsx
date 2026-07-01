import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default function Dashboard() {
    const cards = [
        {
            title: "Productos",
            value: "100",
            caption: "12 low stock",
            icon: Package,
            tone: "orange",
        },
        {
            title: "Clientes",
            value: "50",
            caption: "8 new this week",
            icon: Users,
            tone: "blue",
        },
        {
            title: "Pedidos",
            value: "25",
            caption: "5 pending",
            icon: ShoppingCart,
            tone: "green",
        },
        {
            title: "Ventas",
            value: "$5.2M",
            caption: "18% vs last month",
            icon: TrendingUp,
            tone: "purple",
        },
    ];

    const recentOrders = [
        { customer: "Maria Garcia", amount: "$450.000", status: "Paid", date: "Today" },
        { customer: "Andres Lopez", amount: "$210.000", status: "Pending", date: "Yesterday" },
        { customer: "Comercial Norte", amount: "$1.250.000", status: "Paid", date: "Jun 28" },
        { customer: "Laura Perez", amount: "$89.000", status: "Canceled", date: "Jun 27" },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Dashboard</h1>
                </div>
                <button className="primary-action" type="button">
                    Generar informe
                </button>
            </div>

            <section className="welcome-panel">
                <div>
                    <p>Buenas tardes</p>
                    <h2>Esto es lo que está sucediendo con tu tienda hoy.</h2>
                </div>
                <span>Actualizado hace un momento</span>
            </section>

            <section className="stats-grid">
                {cards.map((card) => (
                    <article className="stat-card" key={card.title}>
                        <span className={`stat-icon ${card.tone}`}>
                            <card.icon size={22} />
                        </span>
                        <div>
                            <p>{card.title}</p>
                            <strong>{card.value}</strong>
                            <span>{card.caption}</span>
                        </div>
                    </article>
                ))}
            </section>

            <section className="dashboard-grid">
                <article className="panel-card">
                    <div className="panel-header">
                        <div>
                            <h2>Órdenes recientes</h2>
                            <p>Actividad comercial más reciente</p>
                        </div>
                    </div>
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={`${order.customer}-${order.date}`}>
                                        <td>{order.customer}</td>
                                        <td>{order.amount}</td>
                                        <td>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </article>

                <article className="panel-card compact-panel">
                    <h2>Salud de la tienda</h2>
                    <div className="health-row">
                        <span>Estado del catálogo</span>
                        <strong>74%</strong>
                    </div>
                    <div className="progress-track">
                        <span style={{ width: "74%" }} />
                    </div>
                    <div className="health-row">
                        <span>Retención de clientes</span>
                        <strong>62%</strong>
                    </div>
                    <div className="progress-track">
                        <span style={{ width: "62%" }} />
                    </div>
                </article>
            </section>
        </div>
    );
}
