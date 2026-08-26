import { plans } from "../data/content";
import { SIGNUP_URL } from "../lib/adminUrl";

export default function Pricing() {
    return (
        <section id="planes" className="py-20">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-xl">
                    <h2 className="font-display text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                        Un plan para cada tamaño de negocio.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-soft)]">
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
                                    ? "border-[var(--color-stamp)] bg-[var(--color-stamp-soft)]"
                                    : "border-[var(--color-paper-line)] bg-[var(--color-paper-raised)]"
                            }`}
                        >
                            <p className="font-display text-xl font-semibold text-[var(--color-ink)]">
                                {plan.name}
                            </p>

                            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-ink-faint)]">
                                {plan.trialDays
                                    ? `${plan.trialDays} días de prueba`
                                    : "Sin límite de tiempo"}
                            </p>

                            <ul className="mt-5 flex flex-col gap-2 text-sm text-[var(--color-ink-soft)]">
                                <li>{plan.limits.products}</li>
                                <li>{plan.limits.staff}</li>
                                <li>{plan.limits.warehouses}</li>
                            </ul>

                            <div className="my-5 border-t border-dashed border-[var(--color-paper-line)]" />

                            <ul className="flex flex-col gap-2 text-sm text-[var(--color-ink)]">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-2">
                                        <span className="text-[var(--color-forest)]">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={SIGNUP_URL}
                                className={`mt-7 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                                    plan.highlight
                                        ? "bg-[var(--color-stamp)] text-white hover:bg-[var(--color-stamp-dark)]"
                                        : "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
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
