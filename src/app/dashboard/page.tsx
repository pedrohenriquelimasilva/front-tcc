"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { relativeDate } from "@/lib/format";
import type {
  ChallengeListItem,
  Page,
  SubmissionListItem,
  SkillOut,
  UserStatsOut,
  SubmissionStatus,
} from "@/lib/types";
import {
  ArrowUpRight,
  Clock,
  Flame,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

function Sparkline({
  data,
  accent = "var(--color-brand)",
}: {
  data: number[];
  accent?: string;
}) {
  if (data.length < 2) {
    return (
      <div className="flex h-[60px] items-center justify-center text-[11px] text-muted">
        ainda sem dados suficientes
      </div>
    );
  }
  const w = 240;
  const h = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((d, i) => `${i * step},${h - ((d - min) / range) * h * 0.85 - 5}`)
    .join(" ");
  const area = `M0,${h} L${points.replace(/ /g, " L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkfill)" />
      <polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const x = i * step;
        const y = h - ((d - min) / range) * h * 0.85 - 5;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === data.length - 1 ? 3.5 : 0}
            fill={accent}
          />
        );
      })}
    </svg>
  );
}

function statusTone(status: SubmissionStatus) {
  if (status === "Aprovado")
    return { dot: "bg-lime", text: "text-lime", label: "aprovado" };
  if (status === "Parcial")
    return { dot: "bg-gold", text: "text-gold", label: "parcial" };
  if (status === "Reprovado")
    return { dot: "bg-rose", text: "text-rose", label: "reprovado" };
  return { dot: "bg-sky", text: "text-sky", label: "pendente" };
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const [stats, setStats] = useState<UserStatsOut | null>(null);
  const [skills, setSkills] = useState<SkillOut[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [recommended, setRecommended] = useState<ChallengeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      try {
        const [statsRes, skillsRes, subsRes, recRes] = await Promise.all([
          api.get<UserStatsOut>("/users/me/stats"),
          api.get<SkillOut[]>("/users/me/skills"),
          api.get<Page<SubmissionListItem>>("/submissions/me", { per_page: 5 }),
          api.get<Page<ChallengeListItem>>("/challenges", { per_page: 3 }),
        ]);
        setStats(statsRes);
        setSkills(skillsRes);
        setSubmissions(subsRes.items);
        setRecommended(recRes.items);
      } catch {
        // erros tratados em UI abaixo via estados nulos
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user]);

  if (authLoading || (loading && !stats)) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px]">carregando painel…</span>
        </div>
      </>
    );
  }

  if (!user || !stats) return null;

  const lastScore = stats.recent_scores.at(-1) ?? 0;
  const prevScore = stats.recent_scores.at(-2) ?? lastScore;
  const delta = lastScore - prevScore;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        <header className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <p className="eyebrow mb-3">painel</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
              {greeting()}, {user.name.split(" ")[0]}
              <span className="text-brand">.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-fg-soft">
              {stats.total_solved === 0 ? (
                <>
                  Você ainda não concluiu desafios — vamos começar? Comece pela
                  trilha de <Link href="/challenges" className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand">arrays</Link>.
                </>
              ) : (
                <>
                  Você está há{" "}
                  <span className="text-fg">{stats.current_streak} dias</span>{" "}
                  seguidos praticando e fechou {stats.total_solved} desafios.
                  {delta !== 0 && (
                    <>
                      {" "}
                      Sua última pontuação foi{" "}
                      <span className={delta >= 0 ? "text-lime" : "text-rose"}>
                        {delta >= 0 ? "+" : ""}
                        {delta}
                      </span>{" "}
                      em relação à anterior.
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              href="/feedback"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2.5 text-[13.5px] text-fg-soft transition hover:border-line-strong hover:text-fg"
            >
              ver feedback completo
            </Link>
            <Link
              href="/challenges"
              className="btn-brand inline-flex items-center gap-2"
            >
              novo desafio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="mt-12 grid gap-4 md:grid-cols-4">
          {[
            {
              icon: Target,
              label: "resolvidos",
              value: stats.total_solved,
              tone: "text-brand",
              wash: "bg-brand-wash",
            },
            {
              icon: Flame,
              label: "sequência",
              value: `${stats.current_streak}d`,
              tone: "text-rose",
              wash: "bg-rose-soft",
              trend: `melhor: ${stats.best_streak} dias`,
            },
            {
              icon: Trophy,
              label: "ranking",
              value: `#${stats.ranking}`,
              tone: "text-gold",
              wash: "bg-gold-soft",
            },
            {
              icon: TrendingUp,
              label: "aprovação",
              value: `${stats.approval_rate}%`,
              tone: "text-lime",
              wash: "bg-lime-soft",
            },
          ].map((s) => (
            <div key={s.label} className="card relative overflow-hidden p-5">
              <div className="flex items-start justify-between">
                <span className="eyebrow">{s.label}</span>
                <div className={`rounded-md p-1.5 ${s.wash}`}>
                  <s.icon className={`h-3.5 w-3.5 ${s.tone}`} />
                </div>
              </div>
              <div className="mt-3 font-display text-4xl font-semibold tracking-tight text-fg">
                {s.value}
              </div>
              {s.trend && (
                <div className="mt-1 text-[11.5px] text-muted">{s.trend}</div>
              )}
            </div>
          ))}
        </section>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow mb-2">
                  evolução · últimas {stats.recent_scores.length} submissões
                </p>
                {stats.recent_scores.length > 0 ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl font-semibold tracking-tight text-fg">
                      {lastScore}
                    </span>
                    <span className="text-[13px] text-muted">/100</span>
                    {delta !== 0 && (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                          delta >= 0
                            ? "bg-lime-soft text-lime"
                            : "bg-rose-soft text-rose"
                        }`}
                      >
                        {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[14px] text-muted">
                    envie sua primeira submissão
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Sparkline data={stats.recent_scores} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
              {[
                {
                  label: "média",
                  value: stats.average_score,
                  icon: Zap,
                  color: "text-brand",
                },
                {
                  label: "melhor",
                  value: stats.best_score,
                  icon: Trophy,
                  color: "text-gold",
                },
                {
                  label: "tentados",
                  value: stats.total_attempted,
                  icon: Clock,
                  color: "text-sky",
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <s.icon className={`h-3 w-3 ${s.color}`} />
                    {s.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold text-fg">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow">habilidades por área</p>
              <span className="text-[11px] text-muted">/ 100</span>
            </div>

            <div className="mt-6 space-y-4">
              {skills.length === 0 ? (
                <p className="text-[13px] text-muted">
                  Complete desafios para que a gente mapeie suas habilidades por
                  tema.
                </p>
              ) : (
                skills.map((s) => {
                  const tone =
                    s.value >= 75
                      ? "bg-lime"
                      : s.value >= 55
                        ? "bg-brand"
                        : s.value >= 40
                          ? "bg-gold"
                          : "bg-rose";
                  return (
                    <div key={s.category_slug}>
                      <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                        <span className="text-fg">{s.category_name}</span>
                        <span className="font-mono text-[12px] text-muted">
                          {s.value}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                        <div
                          className={`h-full rounded-full ${tone} transition-all`}
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <div className="flex items-start gap-2.5 rounded-lg bg-brand-wash p-3">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
                <div className="text-[12.5px] leading-relaxed text-fg-soft">
                  <span className="font-medium text-fg">Dica:</span>{" "}
                  resolva um desafio por dia para manter a sequência.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="card overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-line p-5">
              <div>
                <p className="eyebrow">últimas submissões</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-fg">
                  Atividade recente
                </h3>
              </div>
              <Link
                href="/feedback"
                className="text-[13px] text-fg-soft hover:text-brand"
              >
                ver todas →
              </Link>
            </div>

            {submissions.length === 0 ? (
              <div className="px-5 py-10 text-center text-[14px] text-muted">
                Ainda não há submissões. Escolha um desafio para começar.
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {submissions.map((s) => {
                  const t = statusTone(s.status);
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/results/${s.id}`}
                        className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-surface-hi"
                      >
                        <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                        <div className="min-w-0">
                          <p className="truncate text-[14.5px] text-fg group-hover:text-brand">
                            {s.challenge_title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2 text-[11.5px] text-muted">
                            <span className={t.text}>{t.label}</span>
                            <span>·</span>
                            <span>{relativeDate(s.submitted_at)}</span>
                            <span>·</span>
                            <span className="font-mono">{s.language}</span>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-0.5 text-right">
                          <span
                            className={`font-display text-2xl font-semibold ${t.text}`}
                          >
                            {s.score}
                          </span>
                          <span className="text-[10px] text-dim">/100</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="card p-6">
            <p className="eyebrow">progresso por dificuldade</p>
            <div className="mt-6 space-y-5">
              {[
                {
                  label: "Fácil",
                  value: stats.easy,
                  max: 15,
                  color: "bg-lime",
                  textColor: "text-lime",
                },
                {
                  label: "Médio",
                  value: stats.medium,
                  max: 20,
                  color: "bg-gold",
                  textColor: "text-gold",
                },
                {
                  label: "Difícil",
                  value: stats.hard,
                  max: 10,
                  color: "bg-rose",
                  textColor: "text-rose",
                },
              ].map((d) => (
                <div key={d.label}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className={`text-[13.5px] font-medium ${d.textColor}`}>
                      {d.label}
                    </span>
                    <span className="font-mono text-[12px] text-muted">
                      {d.value} / {d.max}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: d.max }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-sm ${
                          i < d.value
                            ? d.color
                            : "border border-line bg-bg"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">recomendados para hoje</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                  Continue por aqui
                </h2>
              </div>
              <Link
                href="/challenges"
                className="text-[13px] text-fg-soft hover:text-brand"
              >
                ver todos →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {recommended.map((c) => {
                const diffTone = {
                  "Fácil": "text-lime bg-lime-soft",
                  "Médio": "text-gold bg-gold-soft",
                  "Difícil": "text-rose bg-rose-soft",
                }[c.difficulty];
                return (
                  <Link
                    key={c.id}
                    href={`/simulation/${c.slug}`}
                    className="card group block p-5 transition hover:border-line-strong"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${diffTone}`}
                      >
                        {c.difficulty.toLowerCase()}
                      </span>
                      <span className="font-mono text-[11px] text-muted">
                        {c.category.name}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-fg group-hover:text-brand">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted line-clamp-2">
                      {c.description.slice(0, 120)}…
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[11.5px] text-muted">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {c.time_limit_minutes}
                        min
                      </span>
                      <span>{Math.round(c.completion_rate)}% concluem</span>
                      <span className="font-mono text-fg-soft transition group-hover:translate-x-0.5 group-hover:text-brand">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
