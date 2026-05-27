"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, ArrowUpRight, Loader2 } from "lucide-react";

import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-2 text-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-[13px]">carregando…</span>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get("next") || "/dashboard";
  const { user, login, loading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(nextUrl);
  }, [authLoading, user, nextUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace(nextUrl);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Não foi possível entrar.");
      } else {
        setError("Servidor indisponível. Tente novamente em alguns instantes.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Painel lateral */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-bg-soft p-10 lg:flex">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-violet/8 blur-3xl" />

        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-brand/15" />
            <span className="absolute inset-[3px] rounded-sm bg-brand" />
            <span className="relative font-display text-[13px] font-bold text-[#120d08]">
              {"{"}
            </span>
          </span>
          <span className="font-display text-[18px] font-semibold text-fg">
            devprep
          </span>
        </Link>

        <div className="relative max-w-md">
          <div className="card relative overflow-hidden p-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] text-muted">
                último problema
              </span>
              <span className="rounded-full bg-lime-soft px-2 py-0.5 font-mono text-[10px] text-lime">
                92/100
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-fg">
              Soma de Dois Números
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
              Solução linear, limpa, com HashMap. Considere renomear{" "}
              <code className="text-brand">need</code> para{" "}
              <code className="text-brand">complement</code>.
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-line pt-3 text-[11px] text-dim">
              <span className="font-mono">O(n) tempo</span>
              <span>·</span>
              <span className="font-mono">O(n) espaço</span>
              <span>·</span>
              <span className="font-mono">14 linhas</span>
            </div>
          </div>

          <p className="mt-8 font-serif text-2xl italic leading-snug text-fg-soft">
            “Entrar é continuar de onde você parou — com tudo no lugar em que
            deixou.”
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-[12px] text-muted">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
          última sessão · há 2 dias
        </div>
      </aside>

      {/* Formulário */}
      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2.5 lg:hidden"
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-md bg-brand/15" />
              <span className="absolute inset-[3px] rounded-sm bg-brand" />
              <span className="relative font-display text-[13px] font-bold text-[#120d08]">
                {"{"}
              </span>
            </span>
            <span className="font-display text-[18px] font-semibold text-fg">
              devprep
            </span>
          </Link>

          <p className="eyebrow mb-3">entrar</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg">
            Bem-vindo<br />de volta.
          </h1>
          <p className="mt-3 text-[14.5px] text-muted">
            Entre com o e-mail que você usou no cadastro.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[12.5px] font-medium text-fg-soft"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <label
                  htmlFor="password"
                  className="text-[12.5px] font-medium text-fg-soft"
                >
                  Senha
                </label>
                <button
                  type="button"
                  className="text-[12px] text-brand hover:text-brand-hi"
                >
                  esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 pr-11 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-surface-hi hover:text-fg"
                  aria-label="Mostrar senha"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-[13px] text-fg-soft">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line bg-surface-raised accent-brand"
              />
              Manter conectado
            </label>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose/30 bg-rose-soft px-3.5 py-2.5 text-[13px] text-rose">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-brand inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Entrando…
                </>
              ) : (
                <>
                  Entrar
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[14px] text-fg-soft">
            Ainda não tem conta?{" "}
            <Link
              href="/register"
              className="text-brand underline decoration-brand/40 underline-offset-[4px] hover:decoration-brand"
            >
              criar uma agora
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
