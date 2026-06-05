"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ApiError, api } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { formatDuration } from "@/lib/format";
import type { SubmissionOut } from "@/lib/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Download,
  Lightbulb,
  Loader2,
  RotateCcw,
  Share2,
  Shield,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";

function ScoreRing({
  score,
  size = 140,
  tone,
}: {
  score: number;
  size?: number;
  tone: string;
}) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - score / 100);
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          className={tone}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-display text-5xl font-semibold ${tone}`}>
          {score}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-dim">
          de 100
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  score,
  icon: Icon,
}: {
  label: string;
  score: number;
  icon: React.ElementType;
}) {
  const tone =
    score >= 80
      ? { text: "text-lime", wash: "bg-lime-soft", bar: "bg-lime" }
      : score >= 60
        ? { text: "text-gold", wash: "bg-gold-soft", bar: "bg-gold" }
        : { text: "text-rose", wash: "bg-rose-soft", bar: "bg-rose" };

  return (
    <div className="card group p-5 transition hover:border-line-strong">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2 ${tone.wash}`}>
          <Icon className={`h-4 w-4 ${tone.text}`} />
        </div>
        <div className="text-right">
          <div className={`font-display text-3xl font-semibold ${tone.text}`}>
            {score}
          </div>
          <div className="font-mono text-[10px] text-dim">/100</div>
        </div>
      </div>
      <h3 className="mt-3 font-display text-base font-semibold text-fg">
        {label}
      </h3>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-bg">
        <div
          className={`h-full rounded-full ${tone.bar} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const params = useParams();
  const submissionId = String(params.id);
  const { user, loading: authLoading } = useRequireAuth();

  const [data, setData] = useState<SubmissionOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get<SubmissionOut>(
          `/submissions/${submissionId}`
        );
        if (!cancelled) setData(res);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Submissão não encontrada.");
        } else if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Não foi possível carregar o resultado.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submissionId, authLoading, user]);

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px]">carregando resultado…</span>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <AlertCircle className="h-8 w-8 text-rose" />
          <p className="font-display text-2xl text-muted">
            {error || "Submissão não encontrada."}
          </p>
          <Link
            href="/feedback"
            className="text-[13px] text-brand underline underline-offset-4"
          >
            ir para o histórico
          </Link>
        </div>
      </>
    );
  }

  const config = {
    Aprovado: {
      tone: "text-lime",
      wash: "bg-lime-soft",
      icon: CheckCircle2,
      label: "Aprovado",
      headline: "Bom trabalho.",
      subline:
        "Sua solução cumpriu o que o problema pedia, com escolhas técnicas acertadas.",
    },
    Parcial: {
      tone: "text-gold",
      wash: "bg-gold-soft",
      icon: AlertCircle,
      label: "Parcial",
      headline: "Quase lá.",
      subline:
        "A direção está certa, mas alguns pontos importantes ainda precisam de ajuste.",
    },
    Reprovado: {
      tone: "text-rose",
      wash: "bg-rose-soft",
      icon: XCircle,
      label: "Reprovado",
      headline: "Sem pressa, vamos revisar.",
      subline:
        "A solução não atendeu aos requisitos. Use a análise abaixo para entender o porquê.",
    },
    Pendente: {
      tone: "text-sky",
      wash: "bg-sky-soft",
      icon: Loader2,
      label: "Pendente",
      headline: "Avaliando…",
      subline: "A avaliação ainda está em curso.",
    },
  }[data.status];

  const StatusIcon = config.icon;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pt-10 pb-20">
        <Link
          href="/feedback"
          className="no-print inline-flex items-center gap-1.5 text-[13px] text-muted transition hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          todos os feedbacks
        </Link>

        <header className="mt-8">
          <div className="card relative overflow-hidden p-8 md:p-10">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/8 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet/8 blur-3xl" />

            <div className="relative grid gap-10 md:grid-cols-[1.4fr_auto] md:items-center">
              <div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] ${config.wash} ${config.tone}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {config.label}
                </div>
                <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
                  {config.headline}
                </h1>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-fg-soft">
                  {data.summary || config.subline}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1 text-[12px] text-muted">
                  <span>desafio:</span>
                  <span className="text-fg">{data.challenge_title}</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    <span className="text-muted">tempo:</span>
                    <span className="font-mono text-fg">
                      {formatDuration(data.time_spent_seconds)}
                    </span>
                  </div>
                  {data.complexity.time && (
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-muted" />
                      <span className="text-muted">tempo:</span>
                      <span className="font-mono text-fg">
                        {data.complexity.time}
                      </span>
                    </div>
                  )}
                  {data.complexity.space && (
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-muted" />
                      <span className="text-muted">espaço:</span>
                      <span className="font-mono text-fg">
                        {data.complexity.space}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-muted" />
                    <span className="text-muted">linguagem:</span>
                    <span className="font-mono text-fg">{data.language}</span>
                  </div>
                </div>
              </div>

              <div className="justify-self-start md:justify-self-end">
                <ScoreRing score={data.score} tone={config.tone} />
              </div>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              <Link
                href={`/simulation/${data.challenge_slug}`}
                className="no-print inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-[13px] text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                tentar novamente
              </Link>
              <button
                onClick={() => window.print()}
                className="no-print inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-[13px] text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                <Download className="h-3.5 w-3.5" />
                exportar pdf
              </button>
              <button
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: `Feedback — ${data.challenge_title}`,
                        url,
                      });
                      return;
                    } catch {
                      // usuário cancelou ou navegador recusou — cai pro clipboard
                    }
                  }
                  try {
                    await navigator.clipboard.writeText(url);
                    alert("Link copiado para a área de transferência.");
                  } catch {
                    alert(url);
                  }
                }}
                className="no-print inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2 text-[13px] text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                <Share2 className="h-3.5 w-3.5" />
                compartilhar
              </button>
              <Link
                href="/challenges"
                className="no-print btn-brand ml-auto inline-flex items-center gap-2"
              >
                próximo desafio
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-2">métricas</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                Quatro lentes sobre sua solução
              </h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Correção" score={data.metrics.correctness} icon={CheckCircle2} />
            <MetricCard label="Eficiência" score={data.metrics.efficiency} icon={Zap} />
            <MetricCard label="Qualidade do código" score={data.metrics.code_quality} icon={Code2} />
            <MetricCard label="Casos extremos" score={data.metrics.edge_cases} icon={Shield} />
          </div>
        </section>

        {data.complexity.explanation && (
          <section className="mt-10">
            <div className="card p-7">
              <div className="mb-5 flex items-baseline justify-between">
                <p className="eyebrow">análise de complexidade</p>
                <span className="text-[11px] text-muted">notação Big-O</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-line bg-bg p-5">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-sky" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      tempo
                    </span>
                  </div>
                  <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-sky">
                    {data.complexity.time || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-bg p-5">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-violet" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                      espaço
                    </span>
                  </div>
                  <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-violet">
                    {data.complexity.space || "—"}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-relaxed text-fg-soft">
                {data.complexity.explanation}
              </p>
            </div>
          </section>
        )}

        {(data.strengths.length > 0 || data.improvements.length > 0) && (
          <section className="mt-10 grid gap-5 md:grid-cols-2">
            {data.strengths.length > 0 && (
              <div className="card p-7">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-md bg-lime-soft p-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-lime" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-fg">
                    O que ficou bom
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {data.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-relaxed">
                      <span className="font-mono text-[11px] text-lime">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-fg-soft">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.improvements.length > 0 && (
              <div className="card p-7">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-md bg-gold-soft p-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-gold" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-fg">
                    O que pode melhorar
                  </h3>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {data.improvements.map((s, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-relaxed">
                      <span className="font-mono text-[11px] text-gold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-fg-soft">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {data.code_reviews.length > 0 && (
          <section className="mt-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-2">revisão linha a linha</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-fg">
                  Notas do revisor
                </h2>
              </div>
            </div>
            <div className="card overflow-hidden p-0">
              <ul className="divide-y divide-line">
                {data.code_reviews.map((review, i) => {
                  const cfg = {
                    suggestion: {
                      tone: "text-sky",
                      wash: "bg-sky-soft",
                      label: "sugestão",
                      icon: Lightbulb,
                    },
                    praise: {
                      tone: "text-lime",
                      wash: "bg-lime-soft",
                      label: "destaque",
                      icon: CheckCircle2,
                    },
                    warning: {
                      tone: "text-gold",
                      wash: "bg-gold-soft",
                      label: "atenção",
                      icon: AlertCircle,
                    },
                  }[review.type];
                  const Icon = cfg.icon;
                  return (
                    <li key={i} className="grid grid-cols-[auto_1fr] gap-4 p-5">
                      <div
                        className={`rounded-md p-1.5 self-start ${cfg.wash}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${cfg.tone}`} />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span
                            className={`text-[11px] uppercase tracking-wider ${cfg.tone}`}
                          >
                            {cfg.label}
                          </span>
                          <span className="rounded-md bg-bg px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
                            linha {review.line}
                          </span>
                        </div>
                        <p className="mt-2 font-serif text-[16px] leading-relaxed text-fg-soft">
                          {review.message}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        <section className="no-print mt-12 card relative overflow-hidden p-8">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1.6fr_1fr] md:items-center">
            <div>
              <p className="eyebrow mb-2">e agora?</p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">
                Continue praticando
              </h3>
              <p className="mt-2 max-w-md text-[14px] text-muted">
                Refaça este problema buscando uma nova abordagem, ou explore a
                biblioteca para o próximo desafio.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Link
                href={`/simulation/${data.challenge_slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2.5 text-[13.5px] text-fg-soft transition hover:border-line-strong hover:text-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                refazer
              </Link>
              <Link
                href="/challenges"
                className="btn-brand inline-flex items-center gap-2"
              >
                próximo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
