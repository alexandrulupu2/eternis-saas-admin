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

  if (!user) return <div className="min-h-screen bg-[#09090b] text-[#d4af37] p-10">Se încarcă ofertele SaaS...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 py-10 px-5 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b-2 border-[#d4af37] pb-5 mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Upgrade Abonament SaaS</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Parohie: <strong className="text-white">{user.email_utilizator}</strong> • Sold actual:{" "}
              <span className="text-[#d4af37] font-bold">{user.credite_disponibile} credite AI</span>
            </p>
          </div>
          <Link
            href={`/user?userId=${userId}`}
            className="border border-[#d4af37] text-[#fef08a] font-bold px-5 py-2.5 rounded-lg hover:bg-[#d4af37] hover:text-black transition text-sm"
          >
            ← Înapoi la Panou Parohie
          </Link>
        </div>

        {/* PLANURI ABONAMENT SAAS */}
        <h2 className="text-2xl font-serif font-bold text-[#fef08a] mb-2">Planuri de Abonament Lunare (SaaS)</h2>
        <p className="text-zinc-400 text-sm mb-6">Alege planul potrivit pentru activitatea parohiei tale.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.length > 0 ? (
            plans.map((plan, idx) => {
              const isCurrent = user.id_abonament === plan.id_abonament;
              const bonusCredits = idx === 0 ? 15 : idx === 1 ? 50 : 150;
              return (
                <div
                  key={plan.id_abonament}
                  className={`bg-[#121215] rounded-2xl p-7 flex flex-col justify-between border-2 transition ${
                    isCurrent ? "border-[#d4af37] shadow-[0_10px_35px_rgba(212,175,55,0.2)]" : "border-zinc-800 hover:border-[#d4af37]/60"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Plan SaaS</span>
                      {isCurrent && (
                        <span className="bg-[#d4af37] text-black text-xs font-black px-2.5 py-0.5 rounded">
                          ACTIV ACUM
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{plan.nume_plan}</h3>
                    <div className="text-3xl font-black text-[#fef08a] mb-4">
                      {plan.pret_lunar ? `${plan.pret_lunar} RON` : "Gratuit"}
                      <span className="text-xs text-zinc-400 font-normal"> / lună</span>
                    </div>
                    <ul className="space-y-2.5 text-sm text-zinc-300 mb-6">
                      <li>✓ Include <strong>+{bonusCredits} credite AI</strong> la activare</li>
                      <li>✓ Generare predici, necroloage și anunțuri</li>
                      <li>✓ Suport tehnic dedicat Eternis</li>
                    </ul>
                  </div>

                  <button
                    disabled={processing}
                    onClick={() => handleUpgrade(plan.id_abonament, bonusCredits, plan.nume_plan)}
                    className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3.5 rounded-xl uppercase text-xs tracking-wider hover:opacity-95 transition cursor-pointer"
                  >
                    {isCurrent ? "Reînnoiește Planul" : "Activează Acest Plan ➔"}
                  </button>
                </div>
              );
            })
          ) : (
            <>
              <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Plan Parohial Standard</h3>
                  <div className="text-3xl font-black text-[#fef08a] mb-4">49 RON <span className="text-xs text-zinc-400">/ lună</span></div>
                  <p className="text-sm text-zinc-300 mb-6">✓ +50 credite AI incluse imediat</p>
                </div>
                <button
                  disabled={processing}
                  onClick={() => handleUpgrade(2, 50, "Plan Parohial Standard")}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3.5 rounded-xl uppercase text-xs cursor-pointer"
                >
                  Upgrade la Standard ➔
                </button>
              </div>
              <div className="bg-[#121215] border-2 border-[#d4af37] rounded-2xl p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">Plan Protopopiat Pro</h3>
                  <div className="text-3xl font-black text-[#fef08a] mb-4">99 RON <span className="text-xs text-zinc-400">/ lună</span></div>
                  <p className="text-sm text-zinc-300 mb-6">✓ +150 credite AI incluse imediat</p>
                </div>
                <button
                  disabled={processing}
                  onClick={() => handleUpgrade(3, 150, "Plan Protopopiat Pro")}
                  className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3.5 rounded-xl uppercase text-xs cursor-pointer"
                >
                  Upgrade la Pro ➔
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CreditsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] text-[#d4af37] p-10">Se încarcă...</div>}>
      <CreditsContent />
    </Suspense>
  );
}
