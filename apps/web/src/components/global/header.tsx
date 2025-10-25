import { useAuth } from "@/context/AuthContext";
import { DropdownMenuOptions } from "./dropdown-menu-options";
import { Link } from "@tanstack/react-router";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="relative flex items-center px-8 py-4 bg-gradient-to-r from-[#111827] via-[#0B0F19] to-[#0F172A] border-b border-blue-800/30 shadow-lg backdrop-blur-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <img
          src="/icon.png"
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          TaskFlow
        </span>
      </Link>

      {/* Menu à direita */}
      <nav className="ml-auto flex items-center gap-6 text-sm">
        {user ? (
          <DropdownMenuOptions />
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-300"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
