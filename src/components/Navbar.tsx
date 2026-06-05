"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import { useAuth } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Painel" },
  { href: "/challenges", label: "Desafios" },
  { href: "/feedback", label: "Feedback" },
  { href: "/profile", label: "Perfil" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-line">
      <div className="mx-auto flex h-[66px] max-w-[1280px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5" aria-label="DevPrep">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-md bg-brand/15" />
              <span className="absolute inset-[3px] rounded-sm bg-brand" />
              <span className="relative font-display text-[13px] font-bold text-[#120d08]">
                {"{"}
              </span>
            </span>
            <span className="font-display text-[18px] font-semibold tracking-tight text-fg">
              devprep
            </span>
            <span className="live-dot ml-0.5 h-1.5 w-1.5 rounded-full bg-lime" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active =
                l.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-1.5 text-[13.5px] transition ${
                    active ? "text-fg" : "text-muted hover:text-fg-soft"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-surface-hi" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-surface-raised" />
          ) : user ? (
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-[13px] text-fg-soft transition hover:border-rose/40 hover:text-rose"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          ) : (
            <Link
              href="/login"
              className="btn-brand inline-flex items-center gap-1.5"
            >
              Entrar
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-fg-soft hover:bg-surface-hi md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg-soft md:hidden">
          <div className="flex flex-col gap-1 px-6 py-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-[15px] text-fg-soft hover:bg-surface-hi"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="mt-2 rounded-full border border-line px-4 py-2.5 text-[14px] text-fg-soft"
              >
                Sair ({user.name.split(" ")[0]})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-brand mt-2 text-center"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
