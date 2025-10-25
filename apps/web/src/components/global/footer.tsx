export function Footer() {
    return (
        <footer className="py-8 border-t border-blue-800/20 text-center text-xs sm:text-sm text-gray-500 px-4">
           © {new Date().getFullYear()} TaskFlow. Todos os direitos reservados.
        </footer>
    )
}