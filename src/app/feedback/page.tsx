"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { formatDuration, relativeDate } from "@/lib/format";
import type {
  FeedbackSummary,
  Page,
  SubmissionOut,
  SubmissionStatus,
} from "@/lib/types";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Filter,
  Lightbulb,
  Loader2,
  RotateCcw,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

type StatusFilter = "todos" | SubmissionStatus;

function statusInfo(status: SubmissionStatus) {
  if (status === "Aprovado")
    return {
      tone: "text-lime",
      wash: "bg-lime-soft",
      dot: "bg-lime",
      icon: CheckCircle2,
      label: "aprovado",
    };
  if (status === "Parcial")
    return {
      tone: "text-gold",
      wash: "bg-gold-soft",
      dot: "bg-gold",
      icon: AlertCircle,
      label: "parcial",
    };
  if (status === "Reprovado")
    return {
      tone: "text-rose",
      wash: "bg-rose-soft",
      dot: "bg-rose",
      icon: XCircle,
      label: "reprovado",
    };
  return {
    tone: "text-sky",
    wash: "bg-sky-soft",
    dot: "bg-sky",
    icon: Loader2,
    label: "pendente",
  };
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 80
      ? { bar: "bg-lime", text: "text-lime" }
      : value >= 60
        ? { bar: "bg-gold", text: "text-gold" }
        : { bar: "bg-rose", text: "text-rose" };
  return (
    <div className="flex-1">
      <div className="mb-1 flex items-baseline justify-between text-[11px]">
        <span className="text-muted">{label}</span>
        <span className={`font-mono ${tone.text}`}>{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-bg">
        <div
          className={`h-full rounded-full ${tone.bar}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FeedbackCard({ s }: { s: SubmissionOut }) {
  const [open, setOpen] = useState(false);
  const info = statusInfo(s.status);
  const Icon = info.icon;

  return (
    <article
      className={`card overflow-hidden transition ${
        open ? "border-line-strong" : ""
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-5 p-5 text-left transition hover:bg-surface-hi"
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${info.wash}`}
        >
          <Icon className={`h-4 w-4 ${info.tone}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
              {s.challenge_title}
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ${info.wash} ${info.tone}`}
            >
              {info.label}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted">
            <span>{relativeDate(s.submitted_at)}</span>
            <span className="text-dim">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatDuration(s.time_spent_seconds)}
            </span>
            <span className="text-dim">·</span>
            <span className="flex items-center gap-1">
              <Code2 className="h-3 w-3" /> {s.language}
            </span>
            {s.complexity.time && (
              <>
                <span className="text-dim">·</span>
                <span className="font-mono">{s.complexity.time}</span>
              </>
            )}
            <span className="text-dim">·</span>
            <span className="font-mono">{s.lines_of_code} linhas</span>
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          <div className="text-right">
            <div className={`font-display text-3xl font-semibold ${info.tone}`}>
              {s.score}
            </div>
            <div className="font-mono text-[10px] text-dim">/100</div>
          </div>
          <div
            className={`rounded-md p-1 transition ${open ? "rotate-180" : ""}`}
          >
            <ChevronDown className="h-4 w-4 text-muted" />
          </div>
        </div>
      </button>

      {open && (
        <div className="border-t border-line">
          <div className="grid gap-4 border-b border-line bg-bg/40 p-5 sm:grid-cols-4">
            <MetricBar label="correção" value={s.metrics.correctness} />
            <MetricBar label="eficiência" value={s.metrics.efficiency} />
            <MetricBar label="qualidade" value={s.metrics.code_quality} />
            <MetricBar label="edge cases" value={s.metrics.edge_cases} />
          </div>

          {s.summary && (
            <div className="border-b border-line p-5">
              <div className="flex items-baseline gap-2">
                <span className="eyebrow">resumo do revisor</span>
              </div>
              <p className="mt-3 font-serif text-[16px] leading-[1.6] text-fg-soft">
                <span className="text-brand">“</span>
                {s.summary}
                <span className="text-brand">”</span>
              </p>
            </div>
          )}

          <div className="grid gap-px bg-line md:grid-cols-2">
            <div className="bg-surface-raised p-5">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-lime-soft p-1">
                  <TrendingUp className="h-3 w-3 text-lime" />
                </div>
                <span className="text-[12.5px] font-medium text-fg">
                  Pontos fortes
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {s.strengths.length === 0 ? (
                  <li className="text-[12px] text-muted">
                    sem destaques identificados.
                  </li>
                ) : (
                  s.strengths.map((str, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-fg-soft"
                    >
                      <span className="font-mono text-[11px] text-lime">
                        0{i + 1}
                      </span>
                      <span>{str}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="bg-surface-raised p-5">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-gold-soft p-1">
                  <Lightbulb className="h-3 w-3 text-gold" />
                </div>
                <span className="text-[12.5px] font-medium text-fg">
                  O que pode melhorar
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {s.improvements.length === 0 ? (
                  <li className="text-[12px] text-muted">
                    nenhuma sugestão — ótimo trabalho.
                  </li>
                ) : (
                  s.improvements.map((imp, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-[13px] leading-relaxed text-fg-soft"
                    >
                      <span className="font-mono text-[11px] text-gold">
                        0{i + 1}
                      </span>
                      <span>{imp}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line bg-bg/40 px-5 py-3.5">
            <span className="font-mono text-[11px] text-muted">
              feedback completo:{" "}
              <Link
                href={`/results/${s.id}`}
                className="text-brand hover:underline"
              >
                /results/{s.id.slice(0, 8)}…
              </Link>
            </span>
            <div className="flex items-center gap-2">
              <Link
                href={`/simulation/${s.challenge_slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-[12px] text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                <RotateCcw className="h-3 w-3" />
                refazer
              </Link>
              <Link
                href={`/results/${s.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-[12px] font-medium text-bg transition hover:bg-fg-soft"
              >
                ver completo
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default function FeedbackPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [feedbacks, setFeedbacks] = useState<SubmissionOut[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [sortBy, setSortBy] = useState<"recent" | "score" | "time">("recent");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [sumRes, feedbackRes] = await Promise.all([
        api.get<FeedbackSummary>("/feedback/summary"),
        api.get<Page<SubmissionOut>>("/feedback/me", {
          q: search || undefined,
          status: statusFilter === "todos" ? undefined : statusFilter,
          sort: sortBy,
          per_page: 20,
        }),
      ]);
      setSummary(sumRes);
      setFeedbacks(feedbackRes.items);
      setTotalCount(feedbackRes.meta.total);
    } catch {
      // estados vazios cobrem o erro
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, sortBy]);

  useEffect(() => {
    if (authLoading || !user) return;
    const t = setTimeout(fetchData, 250);
    return () => clearTimeout(t);
  }, [authLoading, user, fetchData]);

  const displaySummary = useMemo(
    () =>
      summary || {
        total: 0,
        approved: 0,
        partial: 0,
        rejected: 0,
        average_score: 0,
        best_score: 0,
        recurring_weakness: null,
      },
    [summary]
  );

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px]">carregando…</span>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        <header className="grid gap-8 border-b border-line pb-10 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="eyebrow mb-3">feedback</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
              Tudo que o revisor
              <br />
              já te disse<span className="text-brand">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-fg-soft">
              {displaySummary.total === 0
                ? "Você ainda não tem submissões avaliadas. Comece um desafio para ver o feedback aqui."
                : `${displaySummary.total} submissões avaliadas até aqui. Clique em um cartão para abrir o feedback completo.`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4">
              <div className="font-display text-3xl font-semibold text-lime">
                {displaySummary.approved}
              </div>
              <div className="mt-1 text-[11px] text-muted">aprovados</div>
            </div>
            <div className="card p-4">
              <div className="font-display text-3xl font-semibold text-gold">
                {displaySummary.partial}
              </div>
              <div className="mt-1 text-[11px] text-muted">parciais</div>
            </div>
            <div className="card p-4">
              <div className="font-display text-3xl font-semibold text-rose">
                {displaySummary.rejected}
              </div>
              <div className="mt-1 text-[11px] text-muted">reprovados</div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <p className="eyebrow">média geral</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-fg">
                {displaySummary.average_score}
              </span>
              <span className="text-[12px] text-muted">/100</span>
            </div>
            <p className="mt-2 text-[12px] text-muted">
              considerando {displaySummary.total} submissões
            </p>
          </div>

          <div className="card p-5">
            <p className="eyebrow">melhor pontuação</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-gold">
                {displaySummary.best_score}
              </span>
              <span className="text-[12px] text-muted">/100</span>
            </div>
          </div>

          <div className="card relative overflow-hidden p-5">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/15 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                <p className="eyebrow">padrão recorrente</p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-fg-soft">
                {displaySummary.recurring_weakness ? (
                  <>
                    A área em que você mais perdeu pontos foi{" "}
                    <span className="text-brand">
                      {displaySummary.recurring_weakness}
                    </span>
                    . Vale dedicar atenção extra.
                  </>
                ) : (
                  "Nenhum padrão recorrente ainda — continue praticando."
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="sticky top-[66px] z-30 mt-10 -mx-6 px-6 py-4 backdrop-blur-md">
          <div className="absolute inset-0 -z-10 bg-bg/85" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-line" />

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="buscar por título ou conteúdo do feedback…"
                className="w-full rounded-full border border-line bg-surface-raised py-2.5 pl-10 pr-4 text-[14px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full border border-line bg-surface-raised p-0.5">
                {(
                  ["todos", "Aprovado", "Parcial", "Reprovado"] as StatusFilter[]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1.5 text-[12px] transition ${
                      statusFilter === s
                        ? "bg-fg text-bg"
                        : "text-muted hover:text-fg"
                    }`}
                  >
                    {s === "todos" ? "todos" : s.toLowerCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as typeof sortBy)
                  }
                  className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-[12px] text-fg-soft focus:border-brand focus:outline-none"
                >
                  <option value="recent">mais recentes</option>
                  <option value="score">maior nota</option>
                  <option value="time">menor tempo</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-[13px]">carregando feedbacks…</span>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-full bg-surface-raised p-3">
                <Search className="h-5 w-5 text-muted" />
              </div>
              <p className="mt-5 font-display text-2xl font-semibold text-fg">
                {displaySummary.total === 0
                  ? "Nenhum feedback ainda"
                  : "Nenhum feedback encontrado"}
              </p>
              <p className="mt-1 max-w-sm text-[14px] text-muted">
                {displaySummary.total === 0
                  ? "Envie sua primeira submissão para receber o primeiro feedback."
                  : "tente outra busca ou amplie o filtro de status."}
              </p>
              {displaySummary.total === 0 && (
                <Link
                  href="/challenges"
                  className="btn-brand mt-6 inline-flex items-center gap-2"
                >
                  escolher desafio
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="mb-4 font-mono text-[11px] text-muted">
                {feedbacks.length} de {totalCount} feedbacks
              </p>
              <div className="space-y-3">
                {feedbacks.map((s) => (
                  <FeedbackCard key={s.id} s={s} />
                ))}
              </div>
            </>
          )}
        </section>

        {displaySummary.total > 0 && (
          <section className="mt-12 card relative overflow-hidden p-8">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center">
              <div>
                <p className="eyebrow mb-2">próximo passo</p>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">
                  Cada novo desafio vira um feedback aqui.
                </h3>
                <p className="mt-2 max-w-md text-[14px] text-muted">
                  Mantenha o ritmo — a constância rende mais do que sessões
                  longas.
                </p>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/challenges"
                  className="btn-brand inline-flex items-center gap-2"
                >
                  escolher desafio
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
