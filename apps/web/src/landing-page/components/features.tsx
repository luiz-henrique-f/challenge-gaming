import { Clock, LayoutDashboard, Shield } from "lucide-react";

export function Features() {
    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent to-[#0B0F19]">
            <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tudo que você precisa para gerenciar suas tarefas
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                Ferramentas inteligentes para manter seu fluxo de trabalho
                organizado, simples e eficiente.
            </p>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
                {
                icon: <LayoutDashboard className="w-8 h-8 text-blue-400" />,
                title: "Painel Intuitivo",
                desc: "Visualize e gerencie todas as suas tarefas em um só lugar, com design limpo e moderno.",
                },
                {
                icon: <Clock className="w-8 h-8 text-cyan-400" />,
                title: "Gestão de Tempo",
                desc: "Organize suas prioridades e prazos de forma prática e eficiente.",
                },
                {
                icon: <Shield className="w-8 h-8 text-blue-300" />,
                title: "Segurança e Confiabilidade",
                desc: "Suas informações estão protegidas com autenticação segura e criptografia.",
                },
            ].map((f, i) => (
                <div
                key={i}
                className="p-6 sm:p-8 rounded-2xl bg-[#0F172A]/60 border border-blue-800/30 shadow-xl hover:shadow-blue-600/10 transition-all duration-300 backdrop-blur-md text-center sm:text-left"
                >
                <div className="flex justify-center sm:justify-start mb-4">
                    {f.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-100">
                    {f.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">{f.desc}</p>
                </div>
            ))}
            </div>
        </section>
    )
}