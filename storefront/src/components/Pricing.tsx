import { plans } from "../data/content";
import { SIGNUP_URL } from "../lib/adminUrl";

export default function Pricing() {
    return (
        <section id="planes" className="py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-white)] sm:text-4xl">
                        Un plan para cada tamaño de negocio.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-text-gray)]">
                        Empezá gratis. Subí de plan cuando tu catálogo o tu
                        equipo lo necesiten, no antes.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {plans.map((plan) => (
                        <div
                            key={plan.slug}
                            className={`flex flex-col rounded-2xl border p-6 ${
                                plan.highlight
                                    ? "border-[var(--color-accent)] bg-[rgba(0,188,235,0.06)]"
                                    : "border-[var(--color-bg-line)] bg-[var(--color-bg-raised)]"
                            }`}
                        >
                            <p className="text-xl font-semibold text-[var(--color-text-white)]">
                                {plan.name}
                            </p>

                            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                                {plan.trialDays
                                    ? `${plan.trialDays} días de prueba`
                                    : "Sin límite de tiempo"}
                            </p>

                            <ul className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-text-gray)]">
                                <li>{plan.limits.products}</li>
                                <li>{plan.limits.staff}</li>
                                <li>{plan.limits.warehouses}</li>
                            </ul>

                            <div className="my-5 border-t border-dashed border-[var(--color-bg-line)]" />

                            <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-white)]">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-2">
                                        <span className="text-[var(--color-success)]">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={SIGNUP_URL}
                                className={`mt-7 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                                    plan.highlight
                                        ? "bg-[var(--color-accent)] text-[var(--color-bg-darker)] hover:brightness-110"
                                        : "border border-[var(--color-bg-line)] text-[var(--color-text-white)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                                }`}
                            >
                                {plan.slug === "free" ? "Empezar gratis" : "Hablar con nosotros"}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
