"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UserContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "2";
  const [user, setUser] = useState<any>(null);
  const [tipText, setTipText] = useState("predica");
  const [tema, setTema] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, [userId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Number(userId), tip_text: tipText, tema }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.text);
        setUser((prev: any) => ({ ...prev, credite_disponibile: data.crediteRamase }));
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-[#09090b] text-[#d4af37] p-10">Se încarcă panoul...</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-50 py-10 px-5 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center border-b-2 border-[#d4af37] pb-5 mb-9">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Panou Parohie / Preot</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Conectat ca: <strong className="text-white">{user.email_utilizator}</strong>
            </p>
          </div>
          <Link
            href="/"
            className="text-red-500 font-bold border border-red-500/50 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
          >
            🚪 Deconectare
          </Link>
        </div>

        <div className="bg-[#121215] border border-[#d4af37] p-7 rounded-2xl mb-9 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_10px_30px_rgba(212,175,55,0.15)]">
          <div>
            <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Abonament SaaS Activ</p>
            <h3 className="text-2xl font-serif font-bold text-[#fef08a] mt-1">
              {user.abonamente ? user.abonamente.nume_plan : "Plan Free"}
            </h3>
            <p className="text-zinc-400 text-sm mt-1">Generări asistate de AI pentru predici și anunțuri parohiale.</p>
          </div>
          <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black px-6 py-3.5 rounded-xl font-black text-xl">
            {user.credite_disponibile} credite AI
          </div>
        </div>

        <div className="bg-[#121215] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-serif font-bold text-white">🤖 Asistent AI Parohial (Generare Automată)</h2>
          <p className="text-zinc-400 text-sm mt-1 mb-6">Fiecare generare consumă 1 credit din planul tău SaaS.</p>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block mb-2 text-zinc-200 font-semibold text-sm">Tip conținut de generat:</label>
              <select
                value={tipText}
                onChange={(e) => setTipText(e.target.value)}
                className="w-full p-3.5 rounded-lg border border-zinc-700 bg-[#09090b] text-white"
              >
                <option value="predica">Predică Duminicală / Sărbătoare</option>
                <option value="necrolog">Cuvânt de Rămas Bun / Necrolog</option>
                <option value="anunt">Anunț Parohial / Activitate</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-zinc-200 font-semibold text-sm">Tema sau ideile principale:</label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder='ex: "Pilda Fiului Risipitor"'
                required
                className="w-full p-3.5 rounded-lg border border-zinc-700 bg-[#09090b] text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-4 rounded-lg uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Se generează..." : "✨ Generează Conținut cu AI"}
            </button>
          </form>

          {result && (
            <div className="mt-7 p-6 bg-[#09090b] border border-[#d4af37] rounded-xl">
              <h4 className="text-[#fef08a] font-bold mb-2">Rezultat Generat de NestJS API:</h4>
              <p className="whitespace-pre-line text-zinc-200 leading-relaxed">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] text-[#d4af37] p-10">Se încarcă...</div>}>
      <UserContent />
    </Suspense>
  );
}
