"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ApiError, api } from "@/lib/api";
import type { ChallengeListItem, Difficulty, Page } from "@/lib/types";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Search,
} from "lucide-react";

const categories = [
  "Todos",
  "Arrays",
  "Strings",
  "Pilhas",
  "Listas Ligadas",
  "Busca",
  "Árvores",
  "Design",
];
const difficulties = ["Todos", "Fácil", "Médio", "Difícil"] as const;
type DifficultyFilter = (typeof difficulties)[number];

const categorySlugMap: Record<string, string> = {
  Arrays: "arrays",
  Strings: "strings",
  Pilhas: "pilhas",
  "Listas Ligadas": "listas-ligadas",
  Busca: "busca",
  "Árvores": "arvores",
  Grafos: "grafos",
  Design: "design",
};

function diffTone(d: string) {
  if (d === "Fácil") return "text-lime bg-lime-soft";
  if (d === "Médio") return "text-gold bg-gold-soft";
  return "text-rose bg-rose-soft";
}

export default function ChallengesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [difficulty, setDifficulty] =
    useState<DifficultyFilter>("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [data, setData] = useState<Page<ChallengeListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Page<ChallengeListItem>>("/challenges", {
        q: search || undefined,
        difficulty:
          difficulty === "Todos" ? undefined : (difficulty as Difficulty),
        category: category === "Todos" ? undefined : categorySlugMap[category],
        per_page: 50,
      });
      setData(res);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Não foi possível carregar os desafios.");
    } finally {
      setLoading(false);
    }
  }, [search, difficulty, category]);

  useEffect(() => {
    const id = setTimeout(fetchChallenges, 250); // debounce leve na busca
    return () => clearTimeout(id);
  }, [fetchChallenges]);

  const items = data?.items ?? [];
  const stats = {
    easy: items.filter((c) => c.difficulty === "Fácil").length,
    med: items.filter((c) => c.difficulty === "Médio").length,
    hard: items.filter((c) => c.difficulty === "Difícil").length,
    done: items.filter((c) => c.my_status === "Aprovado").length,
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        {/* HERO */}
        <header className="grid gap-8 border-b border-line pb-10 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <p className="eyebrow mb-3">biblioteca</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
              Desafios<span className="text-brand">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-fg-soft">
              {data ? `${data.meta.total} problemas curados` : "Carregando…"},
              organizados por tema e dificuldade.
              {stats.done > 0 && (
                <>
                  {" "}
                  Você já resolveu{" "}
                  <span className="text-lime">{stats.done}</span>.
                </>
              )}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "fáceis", v: stats.easy, t: "text-lime" },
              { l: "médios", v: stats.med, t: "text-gold" },
              { l: "difíceis", v: stats.hard, t: "text-rose" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-xl border border-line bg-surface-raised p-3"
              >
                <div className={`font-display text-2xl font-semibold ${s.t}`}>
                  {s.v}
                </div>
                <div className="text-[11px] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </header>

        {/* FILTROS */}
        <section className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="buscar por título, tag ou tema…"
              className="w-full rounded-full border border-line bg-surface-raised py-2.5 pl-10 pr-4 text-[14px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-raised p-0.5">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-full px-3 py-1.5 text-[12px] transition ${
                    difficulty === d
                      ? "bg-fg text-bg"
                      : "text-muted hover:text-fg"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-line bg-surface-raised px-4 py-2 text-[13px] text-fg-soft focus:border-brand focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} className="bg-bg-soft">
                  {c}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1 rounded-full border border-line bg-surface-raised p-0.5">
              <button
                onClick={() => setView("grid")}
                className={`rounded-full px-3 py-1.5 text-[11px] transition ${
                  view === "grid" ? "bg-surface-hi text-fg" : "text-muted"
                }`}
              >
                grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-full px-3 py-1.5 text-[11px] transition ${
                  view === "list" ? "bg-surface-hi text-fg" : "text-muted"
                }`}
              >
                lista
              </button>
            </div>
          </div>
        </section>

        {/* ESTADO */}
        {error && (
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-rose/30 bg-rose-soft px-4 py-3 text-[14px] text-rose">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              <p className="font-medium">Não conseguimos carregar os desafios</p>
              <p className="mt-0.5 text-[12.5px] opacity-80">{error}</p>
            </div>
          </div>
        )}

        {loading && !data && (
          <div className="mt-16 flex items-center justify-center gap-2 text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[13px]">carregando desafios…</span>
          </div>
        )}

        {data && items.length === 0 && !loading && (
          <div className="mt-20 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised">
              <Search className="h-5 w-5 text-muted" />
            </div>
            <p className="mt-5 font-display text-2xl font-semibold text-fg">
              Nada por aqui
            </p>
            <p className="mt-1 text-[14px] text-muted">
              tente outro termo ou remova alguns filtros.
            </p>
          </div>
        )}

        {data && items.length > 0 && (
          <>
            {view === "grid" ? (
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <Link
                    key={c.id}
                    href={`/simulation/${c.slug}`}
                    className="card group relative flex flex-col p-5 transition hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${diffTone(c.difficulty)}`}
                      >
                        {c.difficulty.toLowerCase()}
                      </span>
                      {c.my_best_score !== null && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-lime">
                          <CheckCircle2 className="h-3 w-3" />
                          {c.my_best_score}/100
                        </span>
                      )}
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-tight text-fg group-hover:text-brand">
                      {c.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted line-clamp-3">
                      {c.description.slice(0, 140)}…
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {c.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-line bg-bg px-2 py-0.5 font-mono text-[10px] text-muted"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11.5px] text-muted">
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {c.time_limit_minutes}min
                        </span>
                        <span>{Math.round(c.completion_rate)}%</span>
                      </span>
                      <span className="font-mono text-fg-soft transition group-hover:translate-x-0.5 group-hover:text-brand">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {items.map((c, i) => (
                  <li key={c.id}>
                    <Link
                      href={`/simulation/${c.slug}`}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5 transition hover:bg-surface-hi"
                    >
                      <span className="font-mono text-[12px] text-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium ${diffTone(c.difficulty)}`}
                          >
                            {c.difficulty.toLowerCase()}
                          </span>
                          <span className="text-muted">{c.category.name}</span>
                          <span className="text-dim">·</span>
                          <span className="text-muted">
                            {c.time_limit_minutes}min
                          </span>
                          {c.my_best_score !== null && (
                            <span className="ml-auto inline-flex items-center gap-1 text-lime">
                              <CheckCircle2 className="h-3 w-3" />
                              {c.my_best_score}/100
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight text-fg group-hover:text-brand">
                          {c.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted line-clamp-1">
                          {c.description.slice(0, 160)}…
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  );
}
