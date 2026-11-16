"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newCredits, setNewCredits] = useState(15);

  const [creditModalUser, setCreditModalUser] = useState<any>(null);
  const [customCredits, setCustomCredits] = useState<number>(20);

  const loadUsers = async () => {
    const res = await fetch("http://localhost:3001/api/admin/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleConfirmAddCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditModalUser || customCredits <= 0) return;

    await fetch(`http://localhost:3001/api/admin/users/${creditModalUser.id_utilizator}/credits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(customCredits) }),
    });

    setCreditModalUser(null);
    setCustomCredits(20);
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Sigur dorești ștergerea contului?")) return;
    await fetch(`http://localhost:3001/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email_utilizator: newEmail,
        parola_hash: "parola123",
        rol_utilizator: "USER",
        credite_disponibile: newCredits,
      }),
    });
    setNewEmail("");
    setShowModal(false);
    loadUsers();
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-slate-50 font-sans">
      <aside className="w-64 bg-[#121215] border-r border-[#d4af37] p-7 flex flex-col">
        <div className="text-2xl font-black text-[#d4af37] tracking-widest mb-10 font-serif">
          ✝ ETERNIS ADMIN
        </div>
        <nav className="space-y-3 flex-1">
          <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold px-4 py-3 rounded-lg">
            👥 Parohii Înrolate
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded-lg font-semibold cursor-pointer"
          >
            ➕ Înrolare Preot
          </button>
        </nav>
        <Link href="/" className="text-red-500 font-bold px-4 py-3 hover:underline">
          🚪 Deconectare
        </Link>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center border-b-2 border-[#d4af37] pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Panou de Administrare</h1>
            <p className="text-zinc-400 text-sm mt-1">Arhitectură NestJS + Prisma ORM + PostgreSQL + Next.js</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black px-5 py-3 rounded-lg uppercase text-sm cursor-pointer"
          >
            + Înrolează Parohie / Preot
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-9">
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Parohii Înrolate (USER)</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{users.length}</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Familii Înregistrate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">3</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Programări Active</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">1</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Cimitire Înrolate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">1</div>
          </div>
        </div>

        <h2 className="text-xl font-serif text-white mb-4">Conturi de Preoți / Parohii Înrolate</h2>
        <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c1917] text-[#d4af37] text-xs uppercase">
                <th className="p-4">ID</th>
                <th className="p-4">Email (Login Preot)</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Plan Abonament</th>
                <th className="p-4">Credite AI</th>
                <th className="p-4">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id_utilizator} className="border-t border-zinc-800 hover:bg-[#d4af37]/5">
                  <td className="p-4">#{u.id_utilizator}</td>
                  <td className="p-4 font-bold">{u.email_utilizator}</td>
                  <td className="p-4">
                    <span className="bg-[#d4af37]/15 text-[#fef08a] border border-[#d4af37] px-2.5 py-1 rounded text-xs font-bold">
                      {u.rol_utilizator}
                    </span>
                  </td>
                  <td className="p-4">{u.abonamente ? u.abonamente.nume_plan : "Plan Free"}</td>
                  <td className="p-4 text-[#d4af37] font-extrabold">{u.credite_disponibile} credite</td>
                  <td className="p-4 flex gap-3 items-center">
                    <button
                      onClick={() => {
                        setCreditModalUser(u);
                        setCustomCredits(20);
                      }}
                      className="bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#d4af37] hover:text-black transition cursor-pointer"
                    >
                      Adaugă credite suplimentare
                    </button>
                    <button
                      onClick={() => handleDelete(u.id_utilizator)}
                      className="text-red-500 text-xs font-bold hover:underline cursor-pointer"
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleCreateUser} className="bg-[#121215] border border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-xl font-serif font-bold text-[#fef08a]">Înrolare Parohie / Preot Nou</h3>
              <div>
                <label className="block text-sm mb-1 text-zinc-300">Email Preot:</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 rounded bg-[#09090b] border border-zinc-700 text-white focus:outline-none focus:border-[#d4af37]"
                  placeholder="parohia@biserica.ro"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300">Credite AI inițiale:</label>
                <input
                  type="number"
                  min="1"
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="w-full p-3 rounded bg-[#09090b] border border-zinc-700 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-2.5 rounded-lg cursor-pointer">
                  Salvează
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 text-white py-2.5 rounded-lg cursor-pointer">
                  Anulează
                </button>
              </div>
            </form>
          </div>
        )}

        {creditModalUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <form onSubmit={handleConfirmAddCredits} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-5 shadow-[0_10px_40px_rgba(212,175,55,0.3)]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#fef08a]">Adaugă Credite Suplimentare</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  Cont selectat: <strong className="text-white">{creditModalUser.email_utilizator}</strong>
                </p>
                <p className="text-zinc-400 text-xs mt-0.5">
                  Sold curent: <span className="text-[#d4af37] font-bold">{creditModalUser.credite_disponibile} credite AI</span>
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-zinc-200 font-semibold">
                  Câte credite AI dorești să adaugi?
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  required
                  autoFocus
                  value={customCredits}
                  onChange={(e) => setCustomCredits(Number(e.target.value))}
                  className="w-full p-3.5 rounded-lg bg-[#09090b] border border-[#d4af37] text-white text-lg font-bold focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3 rounded-lg uppercase text-sm tracking-wider cursor-pointer"
                >
                  ✨ Adaugă Creditele
                </button>
                <button
                  type="button"
                  onClick={() => setCreditModalUser(null)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer"
                >
                  Anulează
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
