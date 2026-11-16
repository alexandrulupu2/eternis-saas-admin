"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, parola }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.role === "ADMIN") window.location.href = "http://localhost:3001/admin";
        else router.push(`/user?userId=${data.userId}`);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Eroare de conexiune cu serverul NestJS (port 3001).");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-slate-50 font-serif">
      <div className="flex-[1.4] bg-[#050505] p-10 flex flex-col justify-center items-center border-b-2 lg:border-b-0 lg:border-r-2 border-[#d4af37] text-center">
        <div className="max-w-[660px] w-full flex flex-col items-center">
          <div className="w-full mb-6 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-[0_10px_40px_rgba(212,175,55,0.4)]">
            <img src="/images/imagine.jpg" alt="Eternis Servicii Funerare" className="w-full h-auto block" />
          </div>
          <div className="text-[#d4af37] text-sm tracking-[6px] uppercase font-bold mb-6">
            RESPECT • DEMNITATE • COMPASIUNE
          </div>
          <div className="bg-[#0f0f12]/90 border border-[#d4af37]/60 rounded-2xl p-6 shadow-2xl w-full">
            <p className="text-2xl md:text-3xl font-bold text-[#fef08a] italic leading-relaxed">
              <span className="text-[#d4af37] text-4xl mr-1">“</span>
              Vă creăm tot confortul, să se simtă bine mortul.
              <span className="text-[#d4af37] text-4xl ml-1">”</span>
            </p>
            <div className="text-zinc-400 text-xs mt-3 font-sans tracking-wider uppercase">
              SERVICII PAROHIALE ȘI FUNERARE COMPLETE
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[0.8] bg-[#09090b] p-10 flex flex-col justify-center items-center font-sans">
        <div className="w-full max-w-md bg-[#121215] p-9 rounded-2xl border border-zinc-800 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white text-center mb-1">AUTENTIFICARE</h2>
          <p className="text-zinc-500 text-sm text-center mb-7">Introduceți credențialele de acces în platformă</p>

          {error && (
            <div className="bg-red-500/15 border border-red-500 text-red-300 p-3 rounded-lg text-sm mb-5 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-2 text-zinc-200 text-sm font-semibold">Adresă Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@parohie.ro sau admin@eternis.ro"
                required
                className="w-full p-3.5 rounded-lg border border-zinc-700 bg-[#09090b] text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block mb-2 text-zinc-200 text-sm font-semibold">Parolă Acces:</label>
              <input
                type="password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full p-3.5 rounded-lg border border-zinc-700 bg-[#09090b] text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-4 rounded-lg uppercase tracking-wider hover:opacity-95 transition cursor-pointer"
            >
              ACCES ÎN PANOU ➔
            </button>
          </form>

          <div className="mt-6 text-zinc-600 text-xs text-center">
            © 2026 Eternis Systems • NestJS & Next.js Stack
          </div>
        </div>
      </div>
    </div>
  );
}
