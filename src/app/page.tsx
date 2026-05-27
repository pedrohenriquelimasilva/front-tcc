"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Layers,
  GitBranch,
} from "lucide-react";

const stats = [
  { value: "120+", label: "problemas curados", sub: "de fácil a difícil" },
  { value: "4×", label: "dimensões avaliadas", sub: "correção, eficiência, qualidade, edge cases" },
  { value: "O(log n)", label: "feedback técnico real", sub: "Big-O, complexidade e revisão linha a linha" },
];

const features = [
  {
    tag: "01 — editor",
    title: "Um editor que sai do caminho",
    body: "Monaco integrado, syntax highlighting completo, atalho ⌘↵ para rodar testes. Sem distrações, sem janelas piscando.",
    accent: "brand",
  },
  {
    tag: "02 — feedback",
    title: "Quatro lentes sobre cada solução",
    body: "Correção, eficiência, qualidade do código e cobertura de edge cases. Cada métrica vem com explicação e onde você perdeu pontos.",
    accent: "lime",
  },
  {
    tag: "03 — revisão",
    title: "Comentários linha a linha",
    body: "Como um sênior pareando com você. Destaques do que está bom, sugestões pontuais, alertas para o que pode quebrar em produção.",
    accent: "sky",
  },
  {
    tag: "04 — evolução",
    title: "Histórico que não te julga",
    body: "Painel com as últimas pontuações, evolução por área e o feedback completo de cada submissão — sempre acessível para revisitar.",
    accent: "gold",
  },
];

const tracks = [
  { name: "Arrays & Hashing", count: 18, level: "iniciante → avançado" },
  { name: "Two Pointers & Sliding Window", count: 12, level: "intermediário" },
  { name: "Árvores & Grafos", count: 24, level: "intermediário → avançado" },
  { name: "Programação Dinâmica", count: 16, level: "avançado" },
  { name: "Design de Sistemas", count: 9, level: "avançado" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-[1280px] gap-16 px-6 pt-20 pb-28 md:grid-cols-[1.15fr_1fr] md:items-center md:pt-28">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-[12px] text-fg-soft">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
                feedback automático em ~2s
                <span className="text-dim">·</span>
                <span className="text-muted">v0.2</span>
              </div>

              <h1 className="mt-7 font-display text-[58px] font-semibold leading-[1.02] tracking-[-0.03em] text-fg md:text-[78px]">
                Treine para a<br />
                entrevista que<br />
                <span className="relative">
                  <span className="font-serif italic text-brand">você quer</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 280 12"
                    fill="none"
                  >
                    <path
                      d="M2 8 Q 70 2 140 6 T 278 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="text-brand/50"
                    />
                  </svg>
                </span>
                .
              </h1>

              <p className="mt-7 max-w-[520px] text-[17px] leading-[1.55] text-fg-soft">
                Resolva problemas reais de entrevistas técnicas, receba uma
                análise objetiva da sua solução e veja seu progresso entre uma
                tentativa e outra. Sem ranking, sem ruído.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/register"
                  className="btn-brand inline-flex items-center gap-2"
                >
                  Criar conta gratuita
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/challenges"
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-raised px-5 py-2.5 text-[14px] font-medium text-fg-soft transition hover:border-fg-soft hover:text-fg"
                >
                  Ver desafios
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-[12.5px] text-muted">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                  TypeScript, Python, JS
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime" />
                  retorno em segundos
                </div>
              </div>
            </div>

            {/* IDE mock */}
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-brand/10 via-transparent to-violet/10 blur-2xl" />

              <div className="card overflow-hidden p-0 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
                {/* Title bar */}
                <div className="flex items-center justify-between border-b border-line bg-surface-hi/50 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-lime/70" />
                  </div>
                  <span className="font-mono text-[11px] text-muted">
                    two-sum.ts — devprep
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="rounded bg-bg px-1.5 py-0.5">⌘↵</span>
                  </div>
                </div>

                {/* Code */}
                <div className="grid grid-cols-[36px_1fr] bg-bg-soft font-mono text-[12.5px] leading-[1.7]">
                  <div className="select-none border-r border-line py-4 text-right text-dim">
                    {Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className="px-3">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <pre className="overflow-x-auto py-4 pl-4 pr-4">
                    <span className="text-violet">function</span>{" "}
                    <span className="text-gold">twoSum</span>
                    <span className="text-fg-soft">(</span>
                    <span className="text-sky">nums</span>
                    <span className="text-muted">: </span>
                    <span className="text-lime">number[]</span>
                    <span className="text-fg-soft">, </span>
                    <span className="text-sky">target</span>
                    <span className="text-muted">: </span>
                    <span className="text-lime">number</span>
                    <span className="text-fg-soft">) {`{`}</span>
                    {"\n"}
                    {"  "}
                    <span className="text-violet">const</span>{" "}
                    <span className="text-sky">seen</span>{" "}
                    <span className="text-fg-soft">= </span>
                    <span className="text-violet">new</span>{" "}
                    <span className="text-gold">Map</span>
                    <span className="text-fg-soft">()</span>
                    {"\n\n"}
                    {"  "}
                    <span className="text-violet">for</span>{" "}
                    <span className="text-fg-soft">(</span>
                    <span className="text-violet">let</span>{" "}
                    <span className="text-sky">i</span>{" "}
                    <span className="text-fg-soft">= </span>
                    <span className="text-rose">0</span>
                    <span className="text-fg-soft">; i {"<"} nums.length; i++) {`{`}</span>
                    {"\n"}
                    {"    "}
                    <span className="text-violet">const</span>{" "}
                    <span className="text-sky">need</span>{" "}
                    <span className="text-fg-soft">= target - nums[i]</span>
                    {"\n"}
                    {"    "}
                    <span className="text-violet">if</span>{" "}
                    <span className="text-fg-soft">(seen.has(need)) </span>
                    <span className="text-violet">return</span>{" "}
                    <span className="text-fg-soft">[seen.get(need), i]</span>
                    {"\n"}
                    {"    "}
                    <span className="text-fg-soft">seen.set(nums[i], i)</span>
                    {"\n"}
                    {"  "}
                    <span className="text-fg-soft">{`}`}</span>
                    {"\n"}
                    <span className="text-fg-soft">{`}`}</span>
                  </pre>
                </div>

                {/* Output strip */}
                <div className="border-t border-line bg-surface-raised">
                  <div className="flex items-center gap-3 border-b border-line px-4 py-2 text-[11px]">
                    <span className="font-mono text-muted">retorno</span>
                    <span className="rounded-full bg-lime-soft px-2 py-0.5 font-mono text-[10px] text-lime">
                      92 / 100
                    </span>
                    <span className="ml-auto font-mono text-muted">
                      O(n) tempo · O(n) espaço
                    </span>
                  </div>
                  <div className="space-y-2 px-4 py-3 text-[12px]">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-lime">✓</span>
                      <span className="text-fg-soft">
                        complexidade linear com HashMap — escolha idiomática
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-gold">!</span>
                      <span className="text-fg-soft">
                        renomear <code className="text-brand">need</code> para{" "}
                        <code className="text-brand">complement</code> deixa
                        a intenção mais clara
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-sky">i</span>
                      <span className="text-muted">
                        4 de 4 testes passaram em 18ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* stats strip */}
          <div className="border-y border-line bg-bg-soft/60">
            <div className="mx-auto grid max-w-[1280px] grid-cols-1 divide-y divide-line px-6 md:grid-cols-3 md:divide-x md:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="px-2 py-8 md:px-10">
                  <div className="font-display text-4xl font-semibold tracking-tight text-fg">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[14px] text-fg-soft">{s.label}</div>
                  <div className="mt-1 text-[12px] text-muted">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">como é por dentro</p>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
                Tudo que importa.<br />
                <span className="text-muted">
                  Nada do que costuma atrapalhar.
                </span>
              </h2>
            </div>
            <Link
              href="/challenges"
              className="inline-flex items-center gap-1.5 text-[14px] text-fg-soft hover:text-brand"
            >
              ver desafios <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {features.map((f) => {
              const accentMap: Record<string, string> = {
                brand: "text-brand",
                lime: "text-lime",
                sky: "text-sky",
                gold: "text-gold",
              };
              return (
                <div
                  key={f.title}
                  className="group relative bg-bg-soft p-8 transition hover:bg-surface-raised"
                >
                  <div
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] ${accentMap[f.accent]}`}
                  >
                    {f.tag}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg">
                    {f.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-fg-soft">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TRACKS */}
        <section className="border-t border-line bg-bg-soft">
          <div className="mx-auto max-w-[1280px] px-6 py-24">
            <div className="grid gap-12 md:grid-cols-[0.9fr_1.4fr]">
              <div>
                <p className="eyebrow mb-3">trilhas</p>
                <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
                  Estude por tema,
                  <br />
                  no seu ritmo.
                </h2>
                <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-fg-soft">
                  Cinco trilhas cobrem os tópicos que aparecem em ~90% das
                  entrevistas técnicas. Misture nível e tema como quiser.
                </p>

                <div className="mt-8 flex items-center gap-3 text-[12px] text-muted">
                  <Layers className="h-4 w-4 text-brand" />
                  organizado por progressão lógica
                </div>
                <div className="mt-2.5 flex items-center gap-3 text-[12px] text-muted">
                  <GitBranch className="h-4 w-4 text-brand" />
                  você decide a ordem
                </div>
                <div className="mt-2.5 flex items-center gap-3 text-[12px] text-muted">
                  <Sparkles className="h-4 w-4 text-brand" />
                  novos problemas a cada mês
                </div>
              </div>

              <ul className="divide-y divide-line border-y border-line">
                {tracks.map((t, i) => (
                  <li
                    key={t.name}
                    className="group flex items-center justify-between gap-4 py-5 transition hover:bg-surface-raised"
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[12px] text-dim">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-display text-xl font-medium text-fg group-hover:text-brand">
                          {t.name}
                        </div>
                        <div className="mt-0.5 text-[12px] text-muted">
                          {t.level}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full border border-line bg-bg px-3 py-1 font-mono text-[11px] text-fg-soft">
                        {t.count} problemas
                      </span>
                      <span className="text-fg-soft transition group-hover:translate-x-1 group-hover:text-brand">
                        →
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL / NOTE */}
        <section className="mx-auto max-w-[920px] px-6 py-28 text-center">
          <p className="eyebrow mb-6">princípio do projeto</p>
          <blockquote className="font-serif text-3xl leading-[1.25] text-fg md:text-[40px]">
            <span className="text-brand">“</span>
            Decorar cem problemas serve para o curto prazo. Entender o porquê
            de cada um deles serve para a carreira inteira.
            <span className="text-brand">”</span>
          </blockquote>
          <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-muted">
            <span className="h-px w-6 bg-line-strong" />
            do README do projeto
            <span className="h-px w-6 bg-line-strong" />
          </div>
        </section>

        {/* CTA */}
        <section className="relative border-t border-line bg-bg-soft">
          <div className="mx-auto max-w-[1280px] px-6 py-24">
            <div className="card relative overflow-hidden p-10 md:p-14">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
              <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-violet/10 blur-3xl" />

              <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
                <div>
                  <p className="eyebrow mb-4">comece agora</p>
                  <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-fg md:text-5xl">
                    O primeiro desafio
                    <br />
                    leva 15 minutos.
                  </h2>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-fg-soft">
                    Crie sua conta, escolha um problema na trilha de Arrays e
                    veja como funciona o feedback em poucos minutos.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 md:items-end">
                  <Link
                    href="/register"
                    className="btn-brand inline-flex items-center gap-2"
                  >
                    Criar conta agora
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="text-[13.5px] text-muted underline decoration-line-strong underline-offset-[5px] hover:text-fg"
                  >
                    já tenho uma conta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
