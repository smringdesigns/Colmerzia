import type { SalesYearlyMonth } from "../features/reports/reportsApi";

interface SalesTrendChartProps {
    months: SalesYearlyMonth[];
}

function formatShortMoney(value: number) {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
    return `$${Math.round(value)}`;
}

export default function SalesTrendChart({ months }: SalesTrendChartProps) {
    const width = 720;
    const height = 220;
    const paddingLeft = 44;
    const paddingBottom = 24;
    const paddingTop = 16;

    const maxRevenue = Math.max(1, ...months.map((m) => m.revenue));

    const chartWidth = width - paddingLeft;
    const chartHeight = height - paddingBottom - paddingTop;

    const points = months.map((m, i) => {
        const x = paddingLeft + (i / Math.max(1, months.length - 1)) * chartWidth;
        const y = paddingTop + chartHeight - (m.revenue / maxRevenue) * chartHeight;
        return { x, y, month: m };
    });

    const linePath = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(" ");

    const areaPath =
        `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} ` +
        `L ${points[0].x.toFixed(1)} ${(paddingTop + chartHeight).toFixed(1)} Z`;

    // Líneas guía horizontales (0%, 50%, 100% del máximo).
    const gridLines = [0, 0.5, 1].map((fraction) => paddingTop + chartHeight * (1 - fraction));

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="sales-trend-chart"
            role="img"
            aria-label="Ventas de los últimos 12 meses"
        >
            <defs>
                <linearGradient id="salesTrendFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4648d4" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#4648d4" stopOpacity="0" />
                </linearGradient>
            </defs>

            {gridLines.map((y) => (
                <line
                    key={y}
                    x1={paddingLeft}
                    x2={width}
                    y1={y}
                    y2={y}
                    stroke="#eef0f6"
                    strokeWidth={1}
                />
            ))}

            <text x={0} y={paddingTop + 4} className="sales-trend-axis-label">
                {formatShortMoney(maxRevenue)}
            </text>
            <text x={0} y={paddingTop + chartHeight + 4} className="sales-trend-axis-label">
                $0
            </text>

            <path d={areaPath} fill="url(#salesTrendFill)" />
            <path d={linePath} fill="none" stroke="#4648d4" strokeWidth={2.5} />

            {points.map((p) => (
                <g key={p.month.month}>
                    <circle cx={p.x} cy={p.y} r={3.5} fill="#4648d4" />
                    <text
                        x={p.x}
                        y={height - 4}
                        textAnchor="middle"
                        className="sales-trend-axis-label"
                    >
                        {p.month.label}
                    </text>
                    <title>
                        {p.month.label}: {formatShortMoney(p.month.revenue)} ·{" "}
                        {p.month.orders_count} pedido(s)
                    </title>
                </g>
            ))}
        </svg>
    );
}
