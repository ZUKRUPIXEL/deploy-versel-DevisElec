"use client";

import dynamic from "next/dynamic";
import DevisPDF from "@/components/DevisPDF";
import { useRef, useState, useEffect } from "react";
import { compressImage, fileToBase64 } from "@/lib/imageCompression";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span>Chargement…</span> }
);

export default function NouveauDevisPage() {
  const [clientName, setClientName] = useState("");
  const [chantierType, setChantierType] = useState("Dépannage");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null); // { message, type }
  const [isInputFocused, setIsInputFocused] = useState(false);

  const fileInputRef = useRef(null);

  // Charger le brouillon au démarrage
  useEffect(() => {
    const draft = localStorage.getItem("devisDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.items?.length > 0 || parsed.clientName) {
          setClientName(parsed.clientName || "");
          setChantierType(parsed.chantierType || "Dépannage");
          setItems(parsed.items || []);
        }
      } catch (e) {
        console.error("Erreur lecture brouillon", e);
      }
    }
  }, []);

  // Sauvegarde automatique toutes les 10 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(
        "devisDraft",
        JSON.stringify({ clientName, chantierType, items })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [clientName, chantierType, items]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPhotoPreview(null);
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      const base64 = await fileToBase64(compressedFile);
      setPhotoPreview(base64);
    } catch (error) {
      console.error("Erreur lors du traitement de la photo:", error);
      // Fallback à la méthode simple si la compression échoue
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (!description.trim()) {
      showToast("La description est obligatoire");
      return;
    }
    if (!price) {
      showToast("Le prix est obligatoire et doit être > 0");
      return;
    }

    const numericPrice = Number(
      String(price).replace(",", ".").replace(/[^\d.]/g, "")
    );
    if (!numericPrice || Number.isNaN(numericPrice) || numericPrice <= 0) {
      showToast("Le prix est invalide (doit être > 0)");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        photo: photoPreview,
        description: description.trim(),
        price: numericPrice,
        chantierType,
      },
    ]);

    setDescription("");
    setPrice("");
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const canGeneratePdf = items.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative">
      {/* Composant Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 z-[60] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header - shared with home page */}
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

      <main className="mx-auto max-w-5xl px-4 pb-32 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Nouveau Devis
          </h1>
          <button
            onClick={() => {
              const draft = localStorage.getItem("devisDraft");
              if (draft) {
                try {
                  const parsed = JSON.parse(draft);
                  setClientName(parsed.clientName || "");
                  setChantierType(parsed.chantierType || "Dépannage");
                  setItems(parsed.items || []);
                  showToast("Brouillon chargé avec succès", "success");
                } catch (e) {
                  showToast("Erreur lors de la lecture du brouillon", "error");
                }
              } else {
                showToast("Aucun brouillon trouvé", "error");
              }
            }}
            className="text-xs font-semibold text-[#2563eb] hover:underline"
          >
            Recharger le brouillon
          </button>
        </div>

        <div className="mt-6 space-y-8">
          {/* SECTION 1 - INFORMATIONS CLIENT */}
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
              Informations client
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  htmlFor="clientName"
                  className="text-xs font-medium text-slate-300"
                >
                  Nom du client
                  <span className="text-red-400">*</span>
                </label>
                <input
                  id="clientName"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Ex : M. Dupont"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="chantierType"
                  className="text-xs font-medium text-slate-300"
                >
                  Type de chantier
                </label>
                <select
                  id="chantierType"
                  value={chantierType}
                  onChange={(e) => setChantierType(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <option>Défannage</option>
                  <option>Installation</option>
                  <option>Rénovation</option>
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 2 - AJOUTER UNE LIGNE */}
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
              Ajouter une ligne
            </h2>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-sm shadow-slate-900/50 transition hover:bg-slate-700 sm:w-auto"
                >
                  <span aria-hidden="true">📷</span>
                  <span>Prendre une photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                {photoPreview && (
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300">
                    <span className="inline-flex h-8 w-8 overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
                      <img
                        src={photoPreview}
                        alt="Aperçu de la photo"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span>Photo ajoutée</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="ml-auto p-1 text-red-400 hover:text-red-300 transition-colors rounded"
                      title="Supprimer la photo"
                    >
                      <span aria-hidden="true">❌</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="text-xs font-medium text-slate-300"
                  >
                    Description des travaux
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Ex : Remplacement tableau électrique, ajout différentiel 30 mA..."
                    rows={3}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="text-xs font-medium text-slate-300"
                  >
                    Prix (€)
                  </label>
                  <input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Ex : 250"
                    className="w-full max-w-[200px] rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-base text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#2563eb] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
                >
                  + Ajouter au devis
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3 - APERÇU DU DEVIS */}
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
              Aperçu du devis
            </h2>

            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Ajoutez une première ligne pour voir l&apos;aperçu du devis.
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <div className="mt-0.5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt="Photo du chantier"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg" aria-hidden="true">
                            📷
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-sm font-medium text-slate-100 pr-2">
                            {item.description}
                          </p>
                          <p className="text-sm font-semibold text-[#2563eb] whitespace-nowrap">
                            {item.price.toFixed(2)} €
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-slate-400">
                            Type de chantier : {item.chantierType}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/50 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition"
                            title="Supprimer la ligne"
                          >
                            <span aria-hidden="true" className="text-sm">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-sm">
                <span className="font-medium text-slate-200">Total</span>
                <span className="text-lg font-semibold text-[#2563eb]">
                  {total.toFixed(2)} €
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* BOUTON PDF STICKY MOBILE */}
      {canGeneratePdf && (
        <div className={`fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md ${isInputFocused ? 'hidden md:block' : 'block'}`}>
          <PDFDownloadLink
            document={
              <DevisPDF
                clientName={clientName}
                chantierType={chantierType}
                items={items}
                total={total}
              />
            }
            fileName={`devis-${clientName || "chantier"}-${new Date().toISOString().slice(0, 10)}.pdf`}
            onClick={() => {
              showToast("PDF généré et téléchargement en cours !", "success");
            }}
            className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-2xl shadow-emerald-500/25 transition hover:bg-emerald-400 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {({ loading }) =>
              loading ? "Génération du devis PDF..." : "📥 Télécharger le devis"
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}

