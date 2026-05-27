"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import { formatDate, relativeDate } from "@/lib/format";
import type {
  AchievementOut,
  Page,
  SkillOut,
  SubmissionListItem,
  SubmissionStatus,
  UserStatsOut,
} from "@/lib/types";
import {
  ArrowUpRight,
  Calendar,
  Code2,
  Edit3,
  Flame,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Target,
  Trophy,
} from "lucide-react";

const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
  flame: Flame,
  target: Target,
  trophy: Trophy,
  code: Code2,
  check: Target,
};

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
  const { user, loading: authLoading } = useRequireAuth();

  const [stats, setStats] = useState<UserStatsOut | null>(null);
  const [skills, setSkills] = useState<SkillOut[]>([]);
  const [achievements, setAchievements] = useState<AchievementOut[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      setLoading(true);
      try {
        const [s, sk, ac, subs] = await Promise.all([
          api.get<UserStatsOut>("/users/me/stats"),
          api.get<SkillOut[]>("/users/me/skills"),
          api.get<AchievementOut[]>("/users/me/achievements"),
          api.get<Page<SubmissionListItem>>("/submissions/me", { per_page: 6 }),
        ]);
        setStats(s);
        setSkills(sk);
        setAchievements(ac);
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
                <button className="rounded-full border border-line bg-surface-raised p-1.5 text-muted transition hover:text-fg">
                  <Edit3 className="h-3.5 w-3.5" />
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

            <div className="card p-6">
              <p className="eyebrow mb-5">habilidades</p>
              {skills.length === 0 ? (
                <p className="text-[13px] text-muted">
                  Complete desafios e suas habilidades aparecem aqui.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {skills.map((skill) => {
                    const tone =
                      skill.value >= 75
                        ? "bg-lime"
                        : skill.value >= 55
                          ? "bg-brand"
                          : skill.value >= 40
                            ? "bg-gold"
                            : "bg-rose";
                    return (
                      <div key={skill.category_slug}>
                        <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                          <span className="text-fg">{skill.category_name}</span>
                          <span className="font-mono text-[12px] text-muted">
                            {skill.value}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-bg">
                          <div
                            className={`h-full rounded-full ${tone} transition-all`}
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card p-6">
              <p className="eyebrow mb-5">conquistas</p>
              {achievements.length === 0 ? (
                <p className="text-[13px] text-muted">
                  Nenhuma conquista ainda.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {achievements.map((a) => {
                    const Icon = ACHIEVEMENT_ICONS[a.icon] || Trophy;
                    return (
                      <div
                        key={a.slug}
                        className={`group flex flex-col items-center gap-1.5 rounded-xl border border-line p-3 text-center transition ${
                          a.unlocked
                            ? "bg-surface-raised hover:border-line-strong"
                            : "opacity-40"
                        }`}
                        title={a.description || a.label}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            a.unlocked ? "text-gold" : "text-muted"
                          }`}
                        />
                        <span className="text-[10.5px] leading-tight text-fg-soft">
                          {a.label}
                        </span>
                        <span className="text-[9px] text-dim">
                          {a.unlocked ? "desbloqueada" : "bloqueada"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
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
    </>
  );
}
