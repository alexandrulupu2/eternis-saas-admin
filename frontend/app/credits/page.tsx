"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function CreditsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId") || "2";

  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch("http://localhost:3001/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data));
  }, [userId]);

  const handleUpgrade = async (id_abonament: number | undefined, crediteExtra: number, label: string) => {
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: Number(userId),
          id_abonament,
          crediteExtra,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Felicitări! Ai activat „${label}” (+${crediteExtra} credite AI adăugate).`);
        router.push(`/user?userId=${userId}`);
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#d4af37] flex items-center justify-center text-xl font-serif">
        Se încarcă ofertele SaaS Eternis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 py-14 px-8 lg:px-16 font-sans flex flex-col justify-between">
      <div className="max-w-7xl w-full mx-auto">
        {/* HEADER EXTINS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-[#d4af37] pb-8 mb-12 gap-6">
          <div>
            <span className="text-[#d4af37] text-xs font-extrabold uppercase tracking-[0.25em]">
              ✝ Platforma SaaS Eternis
            </span>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white mt-2">
              Upgrade Abonament & Credite AI
            </h1>
            <p className="text-zinc-300 text-base lg:text-lg mt-3">
              Parohie activă: <strong className="text-white">{user.email_utilizator}</strong>{" "}
              <span className="mx-2 text-[#d4af37]">•</span> Sold disponibil:{" "}
              <span className="bg-[#d4af37]/15 border border-[#d4af37] text-[#fef08a] px-3 py-1 rounded-lg font-extrabold">
                {user.credite_disponibile} credite AI
              </span>
            </p>
          </div>

          <Link
            href={`/user?userId=${userId}`}
            className="border-2 border-[#d4af37] text-[#fef08a] font-bold px-7 py-4 rounded-xl hover:bg-[#d4af37] hover:text-black transition text-base whitespace-nowrap"
          >
            ← Înapoi la Panou Parohie
          </Link>
        </div>

        {/* TITLU SECTIUNE */}
        <div className="mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#fef08a]">
            Planuri de Abonament Lunare (SaaS)
          </h2>
          <p className="text-zinc-400 text-base lg:text-lg mt-2">
            Alege planul potrivit pentru nevoile administrative și pastorale ale parohiei tale. Creditele se adaugă instant în cont.
          </p>
        </div>

        {/* GRID CARDURI SINCRONIZATE CU BAZA DE DATE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isCurrent = user.id_abonament === plan.id_abonament;
            const bonusCredits = Number(plan.credite_lunare) || (idx === 0 ? 15 : idx === 1 ? 50 : 150);
            const numericPrice = plan.pret_simulat !== undefined && plan.pret_simulat !== null ? Number(plan.pret_simulat) : 0;
            const displayPrice = `${numericPrice} RON`;

            const description =
              idx === 0
                ? "Ideal pentru testarea asistentului AI și generări ocazionale."
                : idx === 1
                ? "Recomandat pentru parohii active cu slujbe și anunțuri săptămânale."
                : "Soluția completă pentru parohii mari și protopopiate cu volum ridicat.";

            return (
              <div
                key={plan.id_abonament}
                className={`bg-[#121215] rounded-3xl p-10 min-h-[480px] flex flex-col justify-between border-2 transition-all duration-200 ${
                  isCurrent
                    ? "border-[#d4af37] shadow-[0_15px_50px_rgba(212,175,55,0.25)] scale-[1.02]"
                    : "border-zinc-800 hover:border-[#d4af37]/70"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#d4af37] font-extrabold">
                      Pachet SaaS #{idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="bg-[#d4af37] text-black text-xs font-black px-3.5 py-1 rounded-full tracking-wider">
                        ACTIV ACUM
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl font-serif font-bold text-white mb-3">
                    {plan.nume_plan}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    {description}
                  </p>

                  <div className="border-y border-zinc-800 py-5 mb-7">
                    <div className="text-4xl lg:text-5xl font-black text-[#fef08a]">
                      {displayPrice}
                      <span className="text-base text-zinc-400 font-normal"> / lună</span>
                    </div>
                  </div>

                  <ul className="space-y-4 text-base text-zinc-200 mb-8">
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] font-bold">✓</span>
                      <span>
                        Include <strong className="text-[#fef08a]">+{bonusCredits} credite AI</strong> adăugate imediat
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] font-bold">✓</span>
                      <span>Generare predici duminicale, necroloage și anunțuri</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#d4af37] font-bold">✓</span>
                      <span>
                        {idx === 2 ? "Prioritate maximă și suport dedicat 24/7" : "Suport tehnic și actualizări incluse"}
                      </span>
                    </li>
                  </ul>
                </div>

                <button
                  disabled={processing}
                  onClick={() => handleUpgrade(plan.id_abonament, bonusCredits, plan.nume_plan)}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-4.5 rounded-2xl uppercase text-sm tracking-widest shadow-[0_6px_25px_rgba(212,175,55,0.3)] hover:opacity-95 transition cursor-pointer"
                >
                  {isCurrent ? "Reînnoiește Planul (+Credite)" : "Activează Acest Plan ➔"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090b] text-[#d4af37] flex items-center justify-center text-xl">
          Se încarcă...
        </div>
      }
    >
      <CreditsContent />
    </Suspense>
  );
}
