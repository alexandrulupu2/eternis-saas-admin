'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [conversii, setConversii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [creditModal, setCreditModal] = useState({ open: false, id: null, email: '', credits: 0 });
  const [amount, setAmount] = useState(20);
  const [newUser, setNewUser] = useState({
    email_utilizator: '',
    parola_hash: '',
    credite_disponibile: 15,
  });

  const fetchData = async () => {
    try {
      const [resUsers, resConv] = await Promise.all([
        fetch('http://localhost:3001/api/admin/users'),
        fetch('http://localhost:3001/api/admin/conversii'),
      ]);
      if (resUsers.ok) setUsers(await resUsers.json());
      if (resConv.ok) setConversii(await resConv.json());
    } catch (err) {
      console.error('Eroare la încărcarea datelor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newUser, rol_utilizator: 'USER' }),
      });
      if (res.ok) {
        setShowEnrollModal(false);
        setNewUser({ email_utilizator: '', parola_hash: '', credite_disponibile: 15 });
        fetchData();
      }
    } catch (err) {
      console.error('Eroare la creare cont:', err);
    }
  };

  const handleAddCredits = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${creditModal.id}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      if (res.ok) {
        setCreditModal({ open: false, id: null, email: '', credits: 0 });
        fetchData();
      }
    } catch (err) {
      console.error('Eroare la adăugare credite:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Sigur dorești ștergerea acestui cont?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Eroare la ștergere:', err);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#09090b] text-slate-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#121215] border-r border-[#d4af37] p-7 flex flex-col">
        <div className="text-2xl font-black text-[#d4af37] tracking-widest mb-10 font-serif">
          ✝ ETERNIS ADMIN
        </div>
        <nav className="space-y-3 flex-1">
          <div className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold px-4 py-3 rounded-lg">
            👥 Parohii Înrolate
          </div>
          <a href="#istoricAI" className="text-zinc-400 hover:text-white px-4 py-3 rounded-lg font-semibold block">
            🤖 Istoric Generări AI
          </a>
          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="w-full text-left text-zinc-400 hover:text-white px-4 py-3 rounded-lg font-semibold cursor-pointer"
          >
            ➕ Înrolare Preot
          </button>
        </nav>
        <Link href="/" className="text-red-500 font-bold px-4 py-3 hover:underline">
          🚪 Deconectare
        </Link>
      </aside>

      {/* CONTINUT PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center border-b-2 border-[#d4af37] pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Panou de Administrare Eternis</h1>
            <p className="text-zinc-400 text-sm mt-1">Gestionarea parohiilor înrolate, abonamentelor și creditelor AI</p>
          </div>
          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black px-5 py-3 rounded-lg uppercase text-sm cursor-pointer"
          >
            + Înrolează Parohie / Preot
          </button>
        </div>

        {/* CARDURI STATISTICI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-9">
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Conturi Înregistrate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{users.length}</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Total Credite AI Alocate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">
              {users.reduce((acc, u) => acc + (Number(u.credite_disponibile) || 0), 0)}
            </div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Generări AI Înregistrate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{conversii.length}</div>
          </div>
        </div>

        {/* TABEL CONTURI */}
        <h2 className="text-xl font-serif text-white mb-4">Conturi de Preoți / Parohii Înrolate</h2>
        <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden mb-12">
          {loading ? (
            <div className="p-8 text-center text-zinc-400">Se încarcă datele...</div>
          ) : (
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
                    <td className="p-4">{u.abonamente ? u.abonamente.nume_plan : 'Plan Free'}</td>
                    <td className="p-4 text-[#d4af37] font-extrabold">{u.credite_disponibile} credite</td>
                    <td className="p-4 flex gap-3 items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setCreditModal({
                            open: true,
                            id: u.id_utilizator,
                            email: u.email_utilizator,
                            credits: u.credite_disponibile,
                          })
                        }
                        className="bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#d4af37] hover:text-black transition cursor-pointer"
                      >
                        Adaugă credite
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id_utilizator)}
                        className="text-red-500 text-xs font-bold hover:underline cursor-pointer"
                      >
                        Șterge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SECTIUNE ISTORIC GENERARI AI */}
        <h2 id="istoricAI" className="text-xl font-serif text-white mb-4">
          Istoric Activitate Asistent AI (Tabelul conversii_ai)
        </h2>
        <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-hidden">
          {conversii.length === 0 ? (
            <div className="p-6 text-zinc-400 text-sm">Nu există încă generări AI înregistrate în baza de date.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1917] text-[#d4af37] text-xs uppercase">
                  <th className="p-4">ID</th>
                  <th className="p-4">Text Generat / Rezumat</th>
                  <th className="p-4">Credite Consumate</th>
                  <th className="p-4">Data Generării</th>
                </tr>
              </thead>
              <tbody>
                {conversii.map((c) => (
                  <tr key={c.id_conversie} className="border-t border-zinc-800 hover:bg-[#d4af37]/5">
                    <td className="p-4">#{c.id_conversie}</td>
                    <td className="p-4 text-zinc-300 text-sm max-w-lg truncate">{c.rezultat_output}</td>
                    <td className="p-4 text-[#d4af37] font-bold">{c.credite_consumate} credite</td>
                    <td className="p-4 text-zinc-400 text-sm">
                      {c.data_conversie ? new Date(c.data_conversie).toLocaleString('ro-RO') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* MODAL INROLARE */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateUser} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-[#fef08a]">Înrolare Parohie / Preot Nou</h3>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Email Preot:</label>
              <input
                type="email"
                required
                value={newUser.email_utilizator}
                onChange={(e) => setNewUser({ ...newUser, email_utilizator: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Parolă Acces Preot:</label>
              <input
                type="text"
                required
                value={newUser.parola_hash}
                onChange={(e) => setNewUser({ ...newUser, parola_hash: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Credite AI inițiale:</label>
              <input
                type="number"
                min="1"
                required
                value={newUser.credite_disponibile}
                onChange={(e) => setNewUser({ ...newUser, credite_disponibile: Number(e.target.value) })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3 rounded-lg uppercase text-sm cursor-pointer">
                Salvează
              </button>
              <button type="button" onClick={() => setShowEnrollModal(false)} className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL CREDITE */}
      {creditModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddCredits} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-5 shadow-2xl">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#fef08a]">Adaugă Credite Suplimentare</h3>
              <p className="text-zinc-400 text-sm mt-1">Cont: <strong className="text-white">{creditModal.email}</strong></p>
              <p className="text-zinc-400 text-xs mt-0.5">Sold curent: <span className="text-[#d4af37] font-bold">{creditModal.credits} credite AI</span></p>
            </div>
            <div>
              <label className="block text-sm mb-2 text-zinc-200 font-semibold">Câte credite AI dorești să adaugi?</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max="10000"
                required
                className="w-full p-3.5 rounded-lg bg-[#09090b] border border-[#d4af37] text-white text-lg font-bold"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3 rounded-lg uppercase text-sm cursor-pointer">
                ✨ Adaugă Creditele
              </button>
              <button type="button" onClick={() => setCreditModal({ open: false, id: null, email: '', credits: 0 })} className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
