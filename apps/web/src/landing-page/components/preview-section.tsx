import { CheckCircle2 } from "lucide-react";

export function PreviewSection() {
    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-900/10 via-cyan-800/10 to-transparent blur-3xl" />
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
                <img
                src="/tasks-home.svg"
                alt="TaskFlow Dashboard"
                width={300}
                height={300}
                className="rounded-2xl shadow-2xl border border-blue-800/30 hover:scale-[1.02] transition-transform duration-500 w-full max-w-sm sm:max-w-md"
                />
                <div className="max-w-lg text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Uma experiência fluida e elegante
                </h2>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                    Interface desenvolvida para performance e clareza. Tenha o
                    controle das suas tarefas com poucos cliques, sem distrações.
                </p>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
                    <li className="flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 className="text-cyan-400 w-5 h-5" /> Painéis
                    personalizáveis
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 className="text-cyan-400 w-5 h-5" /> Filtros e
                    prioridades inteligentes
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-2">
                    <CheckCircle2 className="text-cyan-400 w-5 h-5" /> Suporte a
                    equipes e colaboração
                    </li>
                </ul>
                </div>
            </div>
        </section>
    )
}