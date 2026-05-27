"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Send,
  Terminal,
  TestTube2,
  XCircle,
} from "lucide-react";

import { ApiError, api } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { ChallengeOut, SubmissionOut } from "@/lib/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0c0b0a] text-muted">
      carregando editor…
    </div>
  ),
});

type Tab = "problem" | "tests" | "console";

type LanguageId = "typescript" | "python" | "javascript";

function diffTone(d: string) {
  if (d === "Fácil") return "text-lime";
  if (d === "Médio") return "text-gold";
  return "text-rose";
}

function pickStarter(
  starter: Record<string, string>,
  lang: LanguageId
): string {
  return starter[lang] || starter.typescript || Object.values(starter)[0] || "";
}

export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.id);
  const { user, loading: authLoading } = useRequireAuth();

  const [challenge, setChallenge] = useState<ChallengeOut | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [language, setLanguage] = useState<LanguageId>("typescript");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("problem");

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [submission, setSubmission] = useState<SubmissionOut | null>(null);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const startedAt = useRef<number>(Date.now());

  // Carrega o desafio
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    (async () => {
      setLoadingChallenge(true);
      try {
        const data = await api.get<ChallengeOut>(`/challenges/${slug}`);
        if (cancelled) return;
        setChallenge(data);
        setCode(pickStarter(data.starter_code, language));
        setTimeLeft(data.time_limit_minutes * 60);
        startedAt.current = Date.now();
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404)
          setFetchError("Desafio não encontrado.");
        else if (err instanceof ApiError) setFetchError(err.message);
        else setFetchError("Não foi possível carregar o desafio.");
      } finally {
        if (!cancelled) setLoadingChallenge(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, authLoading, user]);

  // Ao trocar de linguagem, atualiza o código de partida SE o usuário ainda
  // não mexeu (heurística simples: se for igual a algum dos starters, troca).
  useEffect(() => {
    if (!challenge) return;
    const starters = Object.values(challenge.starter_code);
    if (!code || starters.includes(code)) {
      setCode(pickStarter(challenge.starter_code, language));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, challenge]);

  // Timer
  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [isPaused, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const timeColor =
    timeLeft < 60 ? "text-rose" : timeLeft < 300 ? "text-gold" : "text-fg";

  const handleRun = async () => {
    if (!challenge) return;
    setActiveTab("tests");
    setRunning(true);
    setConsoleOutput("> executando…\n");
    try {
      // "Rodar" no backend cria uma submissão; mostramos só os test_results e
      // NÃO redirecionamos (usuário ainda está no editor).
      const res = await api.post<SubmissionOut>("/submissions", {
        challenge_id: challenge.id,
        code,
        language,
        time_spent_seconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      setSubmission(res);
      const passed = res.test_results.filter((r) => r.passed).length;
      const total = res.test_results.length;
      setConsoleOutput(
        `> executando ${total} testes…\n\n${res.test_results
          .map(
            (r, i) =>
              `[${String(i + 1).padStart(2, "0")}] ${r.passed ? "✓ ok" : "✗ falhou"}\n     in:       ${r.input}\n     esperado: ${r.expected}${r.passed ? "" : `\n     obtido:   ${r.got ?? "undefined"}`}`
          )
          .join("\n\n")}\n\n→ ${passed}/${total} passaram`
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Falha ao executar. Confira sua conexão.";
      setConsoleOutput(`> erro: ${msg}`);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    setSubmitError(null);
    setSubmitting(true);
    setIsPaused(true);
    try {
      const res = await api.post<SubmissionOut>("/submissions", {
        challenge_id: challenge.id,
        code,
        language,
        time_spent_seconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      router.push(`/results/${res.id}`);
    } catch (err) {
      setIsPaused(false);
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar a submissão."
      );
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    if (!challenge) return;
    setCode(pickStarter(challenge.starter_code, language));
    setSubmission(null);
    setConsoleOutput("");
  };

  if (authLoading || loadingChallenge) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 bg-bg text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-[13px]">carregando simulação…</span>
      </div>
    );
  }

  if (fetchError || !challenge) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-bg">
        <p className="font-display text-2xl text-muted">
          {fetchError || "Desafio não encontrado."}
        </p>
        <button
          onClick={() => router.push("/challenges")}
          className="text-[13px] text-brand underline underline-offset-4"
        >
          voltar para a biblioteca
        </button>
      </div>
    );
  }

  const passedCount = submission?.test_results.filter((r) => r.passed).length ?? 0;
  const totalTests = submission?.test_results.length ?? 0;

  return (
    <div className="flex h-screen flex-col bg-bg">
      <header className="flex h-14 items-center justify-between border-b border-line bg-bg-soft px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/challenges")}
            className="rounded-md p-1.5 text-muted transition hover:bg-surface-hi hover:text-fg"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-baseline gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                challenge.difficulty === "Fácil"
                  ? "bg-lime"
                  : challenge.difficulty === "Médio"
                    ? "bg-gold"
                    : "bg-rose"
              }`}
            />
            <span className="font-display text-[15px] font-semibold text-fg">
              {challenge.title}
            </span>
            <span
              className={`text-[11px] uppercase tracking-wider ${diffTone(challenge.difficulty)}`}
            >
              {challenge.difficulty}
            </span>
            <span className="text-[11px] text-dim">·</span>
            <span className="text-[11px] text-muted">
              {challenge.category.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-full border border-line bg-surface-raised">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="border-r border-line p-1.5 text-muted transition hover:bg-surface-hi hover:text-fg"
              title={isPaused ? "Retomar" : "Pausar"}
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>
            <span className={`px-3 py-1.5 font-mono text-[12.5px] ${timeColor}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageId)}
            className="rounded-full border border-line bg-surface-raised px-3 py-1.5 text-[12px] text-fg-soft focus:border-brand focus:outline-none"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={handleReset}
            className="rounded-full border border-line bg-surface-raised p-2 text-muted transition hover:bg-surface-hi hover:text-fg"
            title="Reiniciar"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-full border border-line bg-surface-raised p-2 text-muted transition hover:bg-surface-hi hover:text-fg"
            title="Tela cheia"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={handleRun}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime-soft px-3.5 py-1.5 text-[12.5px] font-medium text-lime transition hover:bg-lime/20 disabled:opacity-60"
          >
            {running ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3 fill-current" />
            )}
            {running ? "executando…" : "executar"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-brand inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                enviando…
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                submeter
              </>
            )}
          </button>
        </div>
      </header>

      {submitError && (
        <div className="border-b border-rose/30 bg-rose-soft px-4 py-2 text-[12.5px] text-rose">
          <AlertCircle className="mr-1.5 inline h-3.5 w-3.5" />
          {submitError}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {!isFullscreen && (
          <aside className="flex w-[440px] flex-col border-r border-line bg-bg-soft">
            <div className="flex border-b border-line">
              {(
                [
                  { k: "problem", label: "Problema", Icon: BookOpen },
                  { k: "tests", label: "Testes", Icon: TestTube2 },
                  { k: "console", label: "Console", Icon: Terminal },
                ] as const
              ).map((t) => {
                const active = activeTab === t.k;
                return (
                  <button
                    key={t.k}
                    onClick={() => setActiveTab(t.k)}
                    className={`relative flex flex-1 items-center justify-center gap-1.5 py-3 text-[12.5px] transition ${
                      active ? "text-fg" : "text-muted hover:text-fg-soft"
                    }`}
                  >
                    <t.Icon className="h-3.5 w-3.5" />
                    {t.label}
                    {t.k === "tests" && submission && (
                      <span
                        className={`ml-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] ${
                          passedCount === totalTests
                            ? "bg-lime-soft text-lime"
                            : "bg-rose-soft text-rose"
                        }`}
                      >
                        {passedCount}/{totalTests}
                      </span>
                    )}
                    {active && (
                      <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-brand" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === "problem" && (
                <div className="space-y-7 px-6 py-6">
                  <div>
                    <p className="eyebrow mb-3">enunciado</p>
                    <div className="whitespace-pre-line font-serif text-[15.5px] leading-[1.65] text-fg-soft">
                      {challenge.description}
                    </div>
                  </div>

                  {challenge.examples.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">exemplos</p>
                      <div className="space-y-3">
                        {challenge.examples.map((ex, i) => (
                          <div key={i} className="card overflow-hidden p-0">
                            <div className="border-b border-line bg-surface-hi/40 px-3 py-1.5 font-mono text-[10px] text-muted">
                              ex. {String(i + 1).padStart(2, "0")}
                            </div>
                            <div className="space-y-1 px-3 py-2.5 font-mono text-[12px]">
                              <div>
                                <span className="text-dim">in: </span>
                                <span className="text-sky">{ex.input}</span>
                              </div>
                              <div>
                                <span className="text-dim">out: </span>
                                <span className="text-lime">{ex.output}</span>
                              </div>
                            </div>
                            {ex.explanation && (
                              <div className="border-t border-line bg-bg/40 px-3 py-2 text-[12px] italic text-muted">
                                {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {challenge.constraints.length > 0 && (
                    <div>
                      <p className="eyebrow mb-3">restrições</p>
                      <ul className="space-y-1.5 font-mono text-[12px] text-fg-soft">
                        {challenge.constraints.map((c, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-brand">▸</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "tests" && (
                <div className="px-6 py-6">
                  {!submission ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="rounded-full bg-surface-raised p-3">
                        <TestTube2 className="h-5 w-5 text-muted" />
                      </div>
                      <p className="mt-4 text-[14px] text-fg-soft">
                        Pronto para rodar os testes?
                      </p>
                      <button
                        onClick={handleRun}
                        disabled={running}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime-soft px-3.5 py-1.5 text-[12.5px] font-medium text-lime transition hover:bg-lime/20"
                      >
                        <Play className="h-3 w-3 fill-current" /> executar agora
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="card p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="eyebrow">resultado</p>
                            <div className="mt-1 flex items-baseline gap-2">
                              <span
                                className={`font-display text-3xl font-semibold ${
                                  passedCount === totalTests
                                    ? "text-lime"
                                    : "text-rose"
                                }`}
                              >
                                {passedCount}
                              </span>
                              <span className="text-muted">
                                de {totalTests} testes
                              </span>
                            </div>
                          </div>
                          {passedCount === totalTests ? (
                            <CheckCircle2 className="h-8 w-8 text-lime" />
                          ) : (
                            <XCircle className="h-8 w-8 text-rose" />
                          )}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {submission.test_results.map((r, i) => (
                          <div
                            key={i}
                            className={`overflow-hidden rounded-lg border ${
                              r.passed
                                ? "border-lime/20 bg-lime-soft"
                                : "border-rose/20 bg-rose-soft"
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-line/40 px-3 py-2">
                              <div className="flex items-center gap-2">
                                {r.passed ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-rose" />
                                )}
                                <span className="font-mono text-[11.5px] text-fg-soft">
                                  teste {String(i + 1).padStart(2, "0")}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-[10px] uppercase ${
                                  r.passed ? "text-lime" : "text-rose"
                                }`}
                              >
                                {r.passed ? "passou" : "falhou"}
                              </span>
                            </div>
                            <div className="space-y-0.5 px-3 py-2 font-mono text-[11.5px]">
                              <div>
                                <span className="text-dim">in: </span>
                                {r.input}
                              </div>
                              <div>
                                <span className="text-dim">esperado: </span>
                                <span className="text-lime">{r.expected}</span>
                              </div>
                              {!r.passed && (
                                <div>
                                  <span className="text-dim">obtido: </span>
                                  <span className="text-rose">
                                    {r.got ?? "undefined"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "console" && (
                <div className="h-full bg-[#0c0b0a]">
                  <pre className="h-full overflow-y-auto p-5 font-mono text-[12px] leading-[1.6] text-fg-soft">
                    {consoleOutput || (
                      <span className="text-dim">
                        {"// rode os testes para ver a saída aqui"}
                      </span>
                    )}
                  </pre>
                </div>
              )}
            </div>
          </aside>
        )}

        <div className="flex flex-1 flex-col bg-[#0c0b0a]">
          <div className="flex items-center justify-between border-b border-line bg-bg-soft px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span className="font-mono text-[11.5px] text-fg-soft">
                solution.
                {language === "typescript"
                  ? "ts"
                  : language === "python"
                    ? "py"
                    : "js"}
              </span>
              <span className="text-dim">·</span>
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted">
                {language}
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10.5px] text-dim">
              <span>auto-save</span>
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
            </div>
          </div>

          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                padding: { top: 18 },
                fontFamily:
                  "JetBrains Mono, ui-monospace, Menlo, monospace",
                fontLigatures: true,
                renderLineHighlight: "gutter",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
