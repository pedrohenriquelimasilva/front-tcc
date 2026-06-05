"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, relativeDate } from "@/lib/format";
import type {
  Page,
  SubmissionListItem,
  SubmissionStatus,
  UserOut,
  UserStatsOut,
} from "@/lib/types";
import {
  ArrowUpRight,
  Calendar,
  Code2,
  Edit3,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  X,
} from "lucide-react";

function statusTone(status: SubmissionStatus) {
  if (status === "Aprovado")
    return { dot: "bg-lime", text: "text-lime", label: "aprovado" };
  if (status === "Parcial")
    return { dot: "bg-gold", text: "text-gold", label: "parcial" };
  if (status === "Reprovado")
    return { dot: "bg-rose", text: "text-rose", label: "reprovado" };
  return { dot: "bg-sky", text: "text-sky", label: "pendente" };
}

export default function ProfilePage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<UserStatsOut | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      try {
        const [s, subs] = await Promise.all([
          api.get<UserStatsOut>("/users/me/stats"),
          api.get<Page<SubmissionListItem>>("/submissions/me", { per_page: 6 }),
        ]);
        setStats(s);
        setSubmissions(subs.items);
      } catch {
        // Silencioso — estados vazios já exibem UI adequada
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
          <span className="text-[13px]">carregando perfil…</span>
        </div>
      </>
    );
  }

  if (!user) return null;

  const displayStats = stats || {
    total_solved: 0,
    total_attempted: 0,
    approval_rate: 0,
    current_streak: 0,
    best_streak: 0,
    ranking: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    recent_scores: [],
    average_score: 0,
    best_score: 0,
  };

  const preferredLangs =
    user.preferred_languages.length > 0
      ? user.preferred_languages
      : ["TypeScript"];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
        <header className="card relative overflow-hidden p-8 md:p-10">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-violet/8 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-line-strong bg-gradient-to-br from-brand/30 via-brand/10 to-violet/20">
              <span className="font-display text-4xl font-semibold text-fg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div>
              <p className="eyebrow mb-2">perfil</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg">
                  {user.name}
                </h1>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-[12px] text-fg-soft transition hover:border-line-strong hover:text-fg"
                  title="Editar perfil"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  editar
                </button>
              </div>
              {user.bio && (
                <p className="mt-2 max-w-xl text-[14px] text-fg-soft">
                  {user.bio}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {user.email}
                </span>
                {user.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {user.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  membro desde {formatDate(user.created_at)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {preferredLangs.map((l) => (
                  <span
                    key={l}
                    className="rounded-full border border-line bg-surface-raised px-3 py-1 text-[11.5px] text-fg-soft"
                  >
                    {l}
                  </span>
                ))}
              </div>

              {(user.social?.github ||
                user.social?.linkedin ||
                user.social?.website) && (
                <div className="mt-4 flex items-center gap-3 text-muted">
                  {user.social.github && (
                    <a
                      href={user.social.github}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-surface-raised p-2 transition hover:text-fg"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {user.social.linkedin && (
                    <a
                      href={user.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-surface-raised p-2 transition hover:text-fg"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {user.social.website && (
                    <a
                      href={user.social.website}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-surface-raised p-2 transition hover:text-fg"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 self-start lg:self-center">
              <div className="text-right">
                <div className="font-display text-3xl font-semibold text-brand">
                  {displayStats.total_solved}
                </div>
                <div className="text-[11px] text-muted">resolvidos</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold text-rose">
                  {displayStats.current_streak}
                </div>
                <div className="text-[11px] text-muted">streak</div>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-semibold text-gold">
                  #{displayStats.ranking}
                </div>
                <div className="text-[11px] text-muted">ranking</div>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
          <aside className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow mb-5">progresso por dificuldade</p>
              <div className="space-y-5">
                {[
                  {
                    label: "Fácil",
                    value: displayStats.easy,
                    max: 15,
                    color: "bg-lime",
                    text: "text-lime",
                  },
                  {
                    label: "Médio",
                    value: displayStats.medium,
                    max: 20,
                    color: "bg-gold",
                    text: "text-gold",
                  },
                  {
                    label: "Difícil",
                    value: displayStats.hard,
                    max: 10,
                    color: "bg-rose",
                    text: "text-rose",
                  },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <span className={`text-[13px] font-medium ${d.text}`}>
                        {d.label}
                      </span>
                      <span className="font-mono text-[12px] text-muted">
                        {d.value}/{d.max}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: d.max }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${
                            i < d.value ? d.color : "border border-line bg-bg"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          <div className="space-y-6">
            <div className="card p-6">
              <p className="eyebrow mb-5">evolução das pontuações</p>
              {displayStats.recent_scores.length === 0 ? (
                <p className="text-[14px] text-muted">
                  Envie sua primeira submissão para ver a evolução aqui.
                </p>
              ) : (
                <div className="flex h-44 items-end gap-2.5">
                  {displayStats.recent_scores.map((score, i) => {
                    const tone =
                      score >= 80
                        ? "from-lime/60 to-lime"
                        : score >= 60
                          ? "from-gold/60 to-gold"
                          : "from-rose/60 to-rose";
                    return (
                      <div
                        key={i}
                        className="flex flex-1 flex-col items-center gap-2"
                      >
                        <span className="font-mono text-[10px] text-muted">
                          {score}
                        </span>
                        <div className="relative w-full flex-1 overflow-hidden rounded-md bg-bg">
                          <div
                            className={`absolute bottom-0 left-0 right-0 rounded-md bg-gradient-to-t ${tone}`}
                            style={{ height: `${(score / 100) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9.5px] text-dim">
                          S{i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card overflow-hidden p-0">
              <div className="flex items-baseline justify-between border-b border-line p-5">
                <p className="eyebrow">histórico recente</p>
                <Link
                  href="/feedback"
                  className="text-[12.5px] text-fg-soft transition hover:text-brand"
                >
                  ver feedback completo →
                </Link>
              </div>
              {submissions.length === 0 ? (
                <div className="p-10 text-center text-[14px] text-muted">
                  Nada aqui ainda.
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
                            <p className="truncate text-[14px] text-fg group-hover:text-brand">
                              {s.challenge_title}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-muted">
                              <span className={t.text}>{t.label}</span>
                              <span>·</span>
                              <span>{relativeDate(s.submitted_at)}</span>
                              <span className="hidden md:inline">·</span>
                              <span className="hidden font-mono md:inline">
                                {s.language} · {s.lines_of_code} linhas
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-display text-xl font-semibold ${t.text}`}
                            >
                              {s.score}
                            </span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted transition group-hover:text-brand" />
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSaved={async () => {
            await refresh();
            setEditOpen(false);
          }}
        />
      )}
    </>
  );
}

function EditProfileModal({
  user,
  onClose,
  onSaved,
}: {
  user: UserOut;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [languages, setLanguages] = useState(user.preferred_languages.join(", "));
  const [github, setGithub] = useState(user.social?.github ?? "");
  const [linkedin, setLinkedin] = useState(user.social?.linkedin ?? "");
  const [website, setWebsite] = useState(user.social?.website ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    if (!name.trim()) {
      setError("O nome não pode ficar vazio.");
      return;
    }
    setSaving(true);
    try {
      const social: Record<string, string> = {};
      if (github.trim()) social.github = github.trim();
      if (linkedin.trim()) social.linkedin = linkedin.trim();
      if (website.trim()) social.website = website.trim();

      await api.patch<UserOut>("/users/me", {
        name: name.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        preferred_languages: languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
        social,
      });
      await onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar as alterações."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4"
      onClick={() => !saving && onClose()}
    >
      <div
        className="card w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div>
            <p className="eyebrow">editar perfil</p>
            <h2 className="mt-1 font-display text-lg font-semibold text-fg">
              Suas informações
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-line bg-surface-raised p-1.5 text-muted transition hover:text-fg disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <Field label="Nome">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                maxLength={120}
              />
            </Field>

            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="input resize-none"
                maxLength={2000}
                placeholder="Conte rapidamente sobre você"
              />
            </Field>

            <Field label="Localização">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input"
                maxLength={120}
                placeholder="Cidade, país"
              />
            </Field>

            <Field
              label="Linguagens preferidas"
              hint="Separe por vírgulas — ex: TypeScript, Python"
            >
              <input
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="input"
                placeholder="TypeScript, Python"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="GitHub">
                <input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="input"
                  placeholder="https://github.com/seu-user"
                />
              </Field>
              <Field label="LinkedIn">
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="input"
                  placeholder="https://linkedin.com/in/..."
                />
              </Field>
              <Field label="Site">
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input"
                  placeholder="https://..."
                />
              </Field>
            </div>

            {error && (
              <p className="rounded-md border border-rose/30 bg-rose-soft px-3 py-2 text-[12.5px] text-rose">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line bg-bg/40 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-line bg-surface-raised px-4 py-2 text-[13px] text-fg-soft transition hover:bg-surface-hi disabled:opacity-50"
          >
            cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-brand inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            {saving ? "salvando…" : "salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-dim">{hint}</span>}
    </label>
  );
}
