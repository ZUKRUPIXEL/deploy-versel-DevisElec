import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563eb] text-sm font-semibold shadow-md shadow-blue-500/40">
              DE
            </div>
            <span className="text-lg font-semibold tracking-tight">
              DevisElec
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-5xl flex-col items-center px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-16 lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <section className="max-w-xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Créez vos devis
            <span className="block text-[#2563eb]">en 2 clics</span>
          </h1>

          <h2 className="text-lg font-medium text-slate-300 sm:text-xl">
            Photo → Description → Prix → PDF
          </h2>

          <p className="text-sm text-slate-400 sm:text-base">
            Pensée pour les électriciens sur chantier : préparez, validez et
            envoyez vos devis en quelques secondes, directement depuis votre
            smartphone.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
            <Link
              href="/nouveau-devis"
              className="w-full rounded-full bg-[#2563eb] px-8 py-3 text-center text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
            >
              Commencer un devis
            </Link>
          </div>

          <p className="text-xs text-slate-500 sm:text-sm">
            Aucun engagement. Conçu pour être utilisé d&apos;une seule main,
            même avec des gants.
          </p>
        </section>

        {/* Simple visual / card */}
        <section className="mt-10 w-full max-w-sm lg:mt-0">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-xl shadow-blue-900/40">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2563eb]/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-900/20 blur-3xl" />

            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Devis électricien
                </span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Prêt à envoyer
                </span>
              </div>

              <div className="space-y-3 rounded-xl bg-slate-900/70 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Client</span>
                  <span className="font-medium text-slate-100">
                    M. Dupont
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Chantier</span>
                  <span className="font-medium text-slate-100">
                    Mise aux normes tableau
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total estimé</span>
                  <span className="text-base font-semibold text-[#2563eb]">
                    1 350 € HT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="font-semibold">Photo</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Prenez le tableau ou l&apos;installation en photo.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <p className="font-semibold">PDF</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Génération automatique d&apos;un devis propre à signer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
