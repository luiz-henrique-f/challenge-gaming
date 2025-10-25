import { Link } from "@tanstack/react-router";

export function CtaFinal() {
    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 bg-gradient-to-r from-blue-900/20 via-cyan-800/20 to-transparent text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Pronto para otimizar seu fluxo de trabalho?
            </h2>
            <p className="text-gray-400 mb-8 text-sm sm:text-base max-w-2xl mx-auto">
                Crie sua conta gratuita e descubra uma nova forma de produtividade.
            </p>
            <Link
                to="/login"
                className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-600/30 transition-all duration-300 inline-block"
            >
                Começar agora
            </Link>
        </section>
    )
}