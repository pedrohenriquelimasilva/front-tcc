"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const benefits = [
  "Acesso aos desafios técnicos",
  "Feedback automático em quatro dimensões",
  "Histórico completo das suas submissões",
  "Análise de complexidade Big-O",
];

export default function RegisterPage() {
  const router = useRouter();
  const { user, register, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace("/dashboard");
  }, [authLoading, user, router]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("As senhas não conferem.");
      return;
    }
    if (form.password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email.trim(), form.password);
      router.replace("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Não foi possível criar sua conta.");
      } else {
        setError("Servidor indisponível. Tente novamente em alguns instantes.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Força da senha (apenas visual)
  const score = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColors = ["bg-line", "bg-rose", "bg-gold", "bg-sky", "bg-lime"];
  const strengthLabel = ["", "fraca", "razoável", "boa", "ótima"][score];

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Formulário */}
      <section className="relative flex items-center justify-center px-6 py-12 lg:order-1">
        <div className="w-full max-w-[420px]">
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

          <p className="eyebrow mb-3">criar conta</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg">
            Comece a treinar<br />em menos de um minuto.
          </h1>
          <p className="mt-3 text-[14.5px] text-muted">
            Sem cartão, sem trial. Apenas crie sua conta e abra o primeiro
            desafio.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-fg-soft">
                Como prefere ser chamado?
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="seu primeiro nome"
                className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-fg-soft">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="voce@email.com"
                className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-fg-soft">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="ao menos 8 caracteres"
                  className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 pr-11 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-surface-hi hover:text-fg"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Força da senha */}
              {form.password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition ${
                          i <= score ? strengthColors[score] : "bg-line"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-muted">
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[12.5px] font-medium text-fg-soft">
                Confirme a senha
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                placeholder="repita"
                className="w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-[14.5px] text-fg placeholder:text-dim focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            <label className="flex items-start gap-2.5 pt-2 text-[12.5px] leading-relaxed text-fg-soft">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-line bg-surface-raised accent-brand"
                required
              />
              <span>
                Concordo com os{" "}
                <button
                  type="button"
                  className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
                >
                  termos de uso
                </button>{" "}
                e com a{" "}
                <button
                  type="button"
                  className="text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
                >
                  política de privacidade
                </button>
                .
              </span>
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
              className="btn-brand mt-3 inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando conta…
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[14px] text-fg-soft">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-brand underline decoration-brand/40 underline-offset-[4px] hover:decoration-brand"
            >
              entrar agora
            </Link>
          </p>
        </div>
      </section>

      {/* Painel lateral */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-l border-line bg-bg-soft p-10 lg:flex">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-sky/8 blur-3xl" />

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

        <div className="relative">
          <p className="eyebrow mb-4">o que vem com a conta</p>
          <ul className="space-y-3.5">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px]">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-lime-soft">
                  <Check className="h-3 w-3 text-lime" />
                </span>
                <span className="text-fg-soft">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 card relative overflow-hidden p-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-[11px] text-muted">
                quem está usando
              </span>
              <span className="font-mono text-[10px] text-dim">
                últimos 30 dias
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {[
                { v: "1.2k", l: "submissões" },
                { v: "94%", l: "aprovação média" },
                { v: "8min", l: "tempo médio" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-semibold text-fg">
                    {s.v}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative font-serif text-xl italic leading-snug text-muted">
          “A entrevista é uma conversa. Bons códigos vêm de boas leituras.”
        </p>
      </aside>
    </div>
  );
}
