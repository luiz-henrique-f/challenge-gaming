import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center text-center py-20 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/4 w-56 sm:w-72 h-56 sm:h-72 bg-blue-500/20 rounded-[40%] blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-64 sm:w-80 h-64 sm:h-80 bg-cyan-400/10 rounded-[50%] blur-3xl animate-pulse delay-1000" />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight max-w-3xl">
            Organize. Planeje. Domine seu fluxo.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl px-4">
            TaskFlow é o sistema moderno de gerenciamento de tarefas que une
            simplicidade e poder. Controle seu tempo, priorize o que importa e
            alcance mais.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
            <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-600/30"
            >
                Começar Agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300 font-medium text-gray-200"
            >
                Já tenho uma conta
            </Link>
            </div>
      </section>
    )
}