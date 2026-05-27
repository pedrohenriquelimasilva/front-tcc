"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ApiError, api } from "@/lib/api";
import type { ChallengeOut } from "@/lib/types";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Loader2,
  Play,
  Users,
} from "lucide-react";

function diffTone(d: string) {
  if (d === "Fácil") return "text-lime bg-lime-soft";
  if (d === "Médio") return "text-gold bg-gold-soft";
  return "text-rose bg-rose-soft";
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const slug = String(params.id);
  const [challenge, setChallenge] = useState<ChallengeOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get<ChallengeOut>(`/challenges/${slug}`);
        if (!cancelled) setChallenge(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("Desafio não encontrado.");
        } else if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Não foi possível carregar o desafio.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[13px]">carregando desafio…</span>
        </div>
      </>
    );
  }

  if (error || !challenge) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <p className="font-display text-2xl text-muted">
            {error || "Desafio não encontrado."}
          </p>
          <Link
            href="/challenges"
            className="text-[13px] text-brand underline underline-offset-4"
          >
            ver todos os desafios
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pt-10 pb-20">
        <Link
          href="/challenges"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          biblioteca
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11.5px] font-medium ${diffTone(challenge.difficulty)}`}
            >
              {challenge.difficulty.toLowerCase()}
            </span>
            <span className="rounded-full border border-line bg-surface-raised px-3 py-1 text-[11.5px] text-fg-soft">
              {challenge.category.name}
            </span>
            <span className="ml-auto flex items-center gap-3 text-[12px] text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {challenge.time_limit_minutes}min
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />{" "}
                {Math.round(challenge.completion_rate)}% concluem
              </span>
            </span>
          </div>

          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-6xl">
            {challenge.title}
          </h1>

          {challenge.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {challenge.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line bg-surface-raised px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </header>

        <section className="mt-12">
          <p className="eyebrow mb-4">enunciado</p>
          <div className="card p-7">
            <div className="whitespace-pre-line font-serif text-[18px] leading-[1.65] text-fg-soft">
              {challenge.description}
            </div>
          </div>
        </section>

        {challenge.examples.length > 0 && (
          <section className="mt-10">
            <p className="eyebrow mb-4">exemplos</p>
            <div className="space-y-4">
              {challenge.examples.map((ex, i) => (
                <div key={i} className="card overflow-hidden p-0">
                  <div className="flex items-center justify-between border-b border-line bg-surface-hi/40 px-4 py-2.5">
                    <span className="font-mono text-[11px] text-muted">
                      exemplo {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] text-dim">
                      entrada → saída
                    </span>
                  </div>
                  <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-line">
                    <div className="p-5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-dim">
                        entrada
                      </div>
                      <code className="mt-2 block break-all font-mono text-[13px] text-sky">
                        {ex.input}
                      </code>
                    </div>
                    <div className="border-t border-line p-5 md:border-t-0">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-dim">
                        saída
                      </div>
                      <code className="mt-2 block break-all font-mono text-[13px] text-lime">
                        {ex.output}
                      </code>
                    </div>
                  </div>
                  {ex.explanation && (
                    <div className="border-t border-line bg-surface-hi/40 px-5 py-3 text-[13px] italic leading-relaxed text-fg-soft">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {challenge.constraints.length > 0 && (
          <section className="mt-10">
            <p className="eyebrow mb-4">restrições</p>
            <div className="card p-6">
              <ul className="grid gap-3 sm:grid-cols-2">
                {challenge.constraints.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 font-mono text-[12.5px] text-fg-soft"
                  >
                    <span className="text-brand">▸</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="mt-14 card relative overflow-hidden p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-fg">
                Pronto para começar?
              </h3>
              <p className="mt-2 max-w-md text-[14px] text-muted">
                O cronômetro é opcional. Você pode pausar a qualquer momento e
                voltar depois.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-4 py-2.5 text-[13px] text-fg-soft transition hover:border-line-strong hover:text-fg">
                <Bookmark className="h-3.5 w-3.5" />
                salvar para depois
              </button>
              <Link
                href={`/simulation/${challenge.slug}`}
                className="btn-brand inline-flex items-center gap-2"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                iniciar simulação
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
