import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-[1280px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute inset-0 rounded-md bg-brand/15" />
                <span className="absolute inset-[3px] rounded-sm bg-brand" />
                <span className="relative font-display text-[13px] font-bold text-[#120d08]">
                  {"{"}
                </span>
              </span>
              <span className="font-display text-[18px] font-semibold tracking-tight text-fg">
                devprep
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
              Treino cuidadoso de algoritmos com retorno detalhado. Construído
              como trabalho de conclusão em engenharia de software.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-[11px] text-muted">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />
              protótipo em desenvolvimento
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">produto</p>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="/challenges" className="text-fg-soft hover:text-brand">
                  Desafios
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-fg-soft hover:text-brand">
                  Feedback
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-fg-soft hover:text-brand">
                  Painel
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-fg-soft hover:text-brand">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">projeto</p>
            <ul className="space-y-2.5 text-[14px] text-fg-soft">
              <li>TCC — Engenharia de Software</li>
              <li>Centro Universitário Nobre</li>
              <li>2026</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">autor</p>
            <ul className="space-y-2.5 text-[14px] text-fg-soft">
              <li>Pedro Henrique Lima Silva</li>
              <li className="text-muted">Feira de Santana, BA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[12px] text-dim md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} DevPrep. Todos os direitos reservados
            de maneira informal.
          </span>
          <span className="font-mono">build 0.2 · dark edition</span>
        </div>
      </div>
    </footer>
  );
}
