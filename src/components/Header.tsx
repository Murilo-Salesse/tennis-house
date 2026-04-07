"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? "text-primary font-bold border-b-2 border-secondary pb-1 px-3 py-1"
      : "text-emerald-800/60 hover:text-emerald-900 transition-colors px-3 py-1";

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-emerald-50/70 backdrop-blur-xl shadow-[0px_12px_32px_rgba(25,28,26,0.06)]">
        <div className="flex justify-between items-center px-6 md:px-10 py-5 max-w-[1440px] mx-auto">
          <Link href="/" className="flex items-center gap-4">
            <img alt="Tennis House Urbanova Logo" className="h-10 w-auto rounded-lg" src="/logo.jpeg" />
            <span className="text-xl font-extrabold tracking-tighter text-primary font-headline">Tennis House Urbanova</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-['Manrope'] font-semibold tracking-tight">
            <Link className={linkClass("/")} href="/">Início</Link>
            <Link className={linkClass("/reservar")} href="/reservar">Reservar</Link>
            <Link className={linkClass("/#localizacao")} href="/#localizacao">Localização</Link>
            <Link href="/reservar" className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold transition-all duration-300 active:scale-95 shadow-lg shadow-primary/10">
              Reservar Agora
            </Link>
          </div>
          {/* Mobile Menu Icon */}
          <div className="md:hidden text-primary">
            <span className="material-symbols-outlined">menu</span>
          </div>
        </div>
      </nav>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 w-full flex justify-around items-center px-4 pb-4 bg-white/80 backdrop-blur-2xl z-50 h-20 rounded-t-[2.5rem] border-t border-emerald-900/5 shadow-[0px_-10px_40px_rgba(0,0,0,0.08)]">
        <Link
          className={`flex flex-col items-center justify-center ${isActive("/") && !isActive("/reservar") ? "bg-secondary text-primary rounded-full px-6 py-2 shadow-lg shadow-secondary/20 scale-110" : "text-emerald-800/50"}`}
          href="/"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-widest font-bold mt-1">Início</span>
        </Link>
        <Link
          className={`flex flex-col items-center justify-center ${isActive("/reservar") ? "bg-secondary text-primary rounded-full px-6 py-2 shadow-lg shadow-secondary/20 scale-110" : "text-emerald-800/50"}`}
          href="/reservar"
        >
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-widest font-bold mt-1">Reservar</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-emerald-800/50" href="/#localizacao">
          <span className="material-symbols-outlined">distance</span>
          <span className="font-['Inter'] text-[10px] uppercase tracking-widest font-bold mt-1">Local</span>
        </Link>
      </div>
    </>
  );
}
