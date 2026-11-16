'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'plans' | 'ai' | 'transactions'
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [conversii, setConversii] = useState([]);
  const [tranzactii, setTranzactii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  // Filtrare & Căutare
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modale
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email_utilizator: '',
    parola_hash: '',
    rol_utilizator: 'USER',
    credite_disponibile: 15,
    id_abonament: 1,
  });

  const [editModal, setEditModal] = useState({
    open: false,
    id_utilizator: null,
    email_utilizator: '',
    parola_hash: '',
    rol_utilizator: 'USER',
    credite_disponibile: 0,
    id_abonament: 1,
  });

  const [creditModal, setCreditModal] = useState({ open: false, id: null, email: '', credits: 0 });
  const [amount, setAmount] = useState(20);

  const [previewAiModal, setPreviewAiModal] = useState({ open: false, item: null });
  const [editPlanModal, setEditPlanModal] = useState({ open: false, plan: null });

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchAllData = async () => {
    try {
      const [resUsers, resPlans, resConv, resTx] = await Promise.all([
        fetch('http://localhost:3001/api/admin/users'),
        fetch('http://localhost:3001/api/plans'),
        fetch('http://localhost:3001/api/admin/conversii'),
        fetch('http://localhost:3001/api/admin/tranzactii').catch(() => null),
      ]);

      if (resUsers?.ok) setUsers(await resUsers.json());
      if (resPlans?.ok) setPlans(await resPlans.json());
      if (resConv?.ok) setConversii(await resConv.json());
      if (resTx?.ok) setTranzactii(await resTx.json());
    } catch (err) {
      console.error('Eroare la încărcarea datelor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Creare cont nou
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setShowEnrollModal(false);
        setNewUser({ email_utilizator: '', parola_hash: '', rol_utilizator: 'USER', credite_disponibile: 15, id_abonament: 1 });
        showNotification('Parohia / Contul a fost înrolat cu succes!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Editare completă cont
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${editModal.id_utilizator}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal),
      });
      if (res.ok) {
        setEditModal({ ...editModal, open: false });
        showNotification('Datele contului au fost actualizate!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Schimbare rapidă plan abonament direct din tabel
  const handleQuickPlanChange = async (userId, newPlanId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_abonament: Number(newPlanId) }),
      });
      if (res.ok) {
        showNotification('Planul de abonament a fost schimbat!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Adăugare credite
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
        showNotification(`S-au adăugat ${amount} credite AI!`);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ștergere cont
  const handleDeleteUser = async (id, email) => {
    if (!confirm(`Sigur dorești ștergerea definitivă a contului ${email}?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Contul a fost șters din baza de date.');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Actualizare plan abonament SaaS
  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    const p = editPlanModal.plan;
    try {
      const res = await fetch(`http://localhost:3001/api/admin/plans/${p.id_abonament}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
      if (res.ok) {
        setEditPlanModal({ open: false, plan: null });
        showNotification('Planul SaaS a fost actualizat!');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrare utilizatori
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.email_utilizator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.rol_utilizator === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalCredits = users.reduce((acc, u) => acc + (Number(u.credite_disponibile) || 0), 0);
  const totalRevenue = tranzactii.reduce((acc, t) => acc + (Number(t.suma_simulata) || 0), 0);

  return (
    <div className="min-h-screen flex bg-[#09090b] text-slate-50 font-sans">
      {/* NOTIFICARE TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#121215] border-2 border-[#d4af37] text-[#fef08a] px-6 py-3.5 rounded-xl shadow-2xl font-bold z-50 animate-bounce">
          ✨ {toast}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#121215] border-r border-[#d4af37]/50 p-6 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-black text-[#d4af37] tracking-widest mb-2 font-serif">
            ✝ ETERNIS ADMIN
          </div>
          <p className="text-xs text-zinc-500 mb-8">Centru Control Platformă SaaS</p>

          <nav className="space-y-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-between ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>👥 Parohii & Conturi</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">{users.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-between ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>💎 Planuri Abonament</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">{plans.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-between ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>🤖 Istoric Generări AI</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">{conversii.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left px-4 py-3 rounded-lg font-bold transition cursor-pointer flex items-center justify-between ${
                activeTab === 'transactions'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <span>💳 Tranzacții & Încasări</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/20">{tranzactii.length}</span>
            </button>

            <div className="pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowEnrollModal(true)}
                className="w-full text-left text-[#d4af37] hover:bg-[#d4af37]/10 px-4 py-3 rounded-lg font-bold cursor-pointer"
              >
                ➕ Înrolează Preot Nou
              </button>
            </div>
          </nav>
        </div>

        <Link href="/" className="text-red-400 hover:text-red-300 font-bold px-4 py-3 rounded-lg hover:bg-red-950/30 transition">
          🚪 Deconectare
        </Link>
      </aside>

      {/* CONTINUT PRINCIPAL */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center border-b-2 border-[#d4af37] pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white">Panou de Administrare Eternis</h1>
            <p className="text-zinc-400 text-sm mt-1">Control complet asupra parohiilor, abonamentelor SaaS, creditelor și activității AI</p>
          </div>
          <button
            type="button"
            onClick={() => setShowEnrollModal(true)}
            className="bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black px-5 py-3 rounded-lg uppercase text-sm cursor-pointer shadow-lg hover:opacity-95"
          >
            + Înrolează Parohie / Preot
          </button>
        </div>

        {/* CARDURI KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Parohii / Conturi</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{users.length}</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Credite AI în Circulație</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{totalCredits}</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Texte AI Generate</h4>
            <div className="text-3xl font-serif font-black text-[#fef08a]">{conversii.length}</div>
          </div>
          <div className="bg-[#121215] border border-[#d4af37]/40 p-5 rounded-xl">
            <h4 className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Încasări SaaS Simulate</h4>
            <div className="text-3xl font-serif font-black text-emerald-400">{totalRevenue} RON</div>
          </div>
        </div>

        {/* ==================== TAB 1: PAROHII & CONTURI ==================== */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
              <h2 className="text-xl font-serif text-white">Conturi de Preoți / Parohii Înrolate</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="🔍 Caută după email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#121215] border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:border-[#d4af37] outline-none"
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#121215] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="ALL">Toate rolurile</option>
                  <option value="USER">Doar Preoți (USER)</option>
                  <option value="ADMIN">Doar Admini (ADMIN)</option>
                </select>
              </div>
            </div>

            <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-zinc-400">Se încarcă datele din PostgreSQL...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1917] text-[#d4af37] text-xs uppercase">
                      <th className="p-4">ID</th>
                      <th className="p-4">Email (Login Preot)</th>
                      <th className="p-4">Rol</th>
                      <th className="p-4">Plan Abonament (Schimbare Rapidă)</th>
                      <th className="p-4">Credite AI</th>
                      <th className="p-4">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id_utilizator} className="border-t border-zinc-800 hover:bg-[#d4af37]/5">
                        <td className="p-4 text-zinc-400">#{u.id_utilizator}</td>
                        <td className="p-4 font-bold">{u.email_utilizator}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold border ${
                              u.rol_utilizator === 'ADMIN'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500'
                                : 'bg-[#d4af37]/15 text-[#fef08a] border-[#d4af37]'
                            }`}
                          >
                            {u.rol_utilizator}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={u.id_abonament || 1}
                            onChange={(e) => handleQuickPlanChange(u.id_utilizator, e.target.value)}
                            className="bg-[#09090b] border border-zinc-700 hover:border-[#d4af37] rounded px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                          >
                            {plans.map((p) => (
                              <option key={p.id_abonament} value={p.id_abonament}>
                                {p.nume_plan}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-[#d4af37] font-extrabold">{u.credite_disponibile} credite</td>
                        <td className="p-4 flex flex-wrap gap-2 items-center">
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
                            className="bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37] px-2.5 py-1 rounded text-xs font-bold hover:bg-[#d4af37] hover:text-black transition cursor-pointer"
                          >
                            + Credite
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditModal({
                                open: true,
                                id_utilizator: u.id_utilizator,
                                email_utilizator: u.email_utilizator,
                                parola_hash: '',
                                rol_utilizator: u.rol_utilizator,
                                credite_disponibile: u.credite_disponibile,
                                id_abonament: u.id_abonament || 1,
                              })
                            }
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-2.5 py-1 rounded text-xs font-semibold cursor-pointer"
                          >
                            Editează
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id_utilizator, u.email_utilizator)}
                            className="text-red-500 hover:text-red-400 px-2 py-1 text-xs font-bold cursor-pointer"
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
          </div>
        )}

        {/* ==================== TAB 2: PLANURI ABONAMENT ==================== */}
        {activeTab === 'plans' && (
          <div>
            <h2 className="text-xl font-serif text-white mb-4">Configurare Planuri SaaS (Tabelul abonamente)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <div key={p.id_abonament} className="bg-[#121215] border border-[#d4af37]/50 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs uppercase tracking-widest text-[#d4af37] font-bold">Plan #{p.id_abonament}</span>
                      <span className="bg-[#d4af37]/15 text-[#fef08a] px-3 py-1 rounded-full text-xs font-bold">
                        {p.credite_lunare ?? '-'} credite/lună
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{p.nume_plan}</h3>
                    <div className="text-3xl font-black text-[#d4af37] mb-4">
                      {p.pret_simulat ?? 0} <span className="text-sm font-normal text-zinc-400">RON / lună</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-6">{p.descriere || 'Abonament standard pentru gestiune parohială și asistență AI.'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditPlanModal({ open: true, plan: { ...p } })}
                    className="w-full bg-zinc-800 hover:bg-[#d4af37] hover:text-black text-white font-bold py-2.5 rounded-lg text-sm transition cursor-pointer"
                  >
                    ✏️ Editează Preț & Credite
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: ISTORIC GENERARI AI ==================== */}
        {activeTab === 'ai' && (
          <div>
            <h2 className="text-xl font-serif text-white mb-4">Istoric Complet Activitate Asistent AI (conversii_ai)</h2>
            <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-x-auto">
              {conversii.length === 0 ? (
                <div className="p-8 text-zinc-400 text-sm">Nu există încă generări AI înregistrate în baza de date.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1917] text-[#d4af37] text-xs uppercase">
                      <th className="p-4">ID</th>
                      <th className="p-4">Parohie / Utilizator</th>
                      <th className="p-4">Tip Conținut</th>
                      <th className="p-4">Tema / Prompt</th>
                      <th className="p-4">Cost</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Text Generat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversii.map((c) => (
                      <tr key={c.id_conversie} className="border-t border-zinc-800 hover:bg-[#d4af37]/5">
                        <td className="p-4 text-zinc-400">#{c.id_conversie}</td>
                        <td className="p-4 font-semibold text-white">
                          {c.utilizatori?.email_utilizator || `User #${c.id_utilizator}`}
                        </td>
                        <td className="p-4">
                          <span className="bg-[#d4af37]/15 text-[#fef08a] border border-[#d4af37]/50 px-2.5 py-1 rounded text-xs font-bold">
                            {c.tip_conversie}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-300 text-sm max-w-xs truncate">{c.prompt_input}</td>
                        <td className="p-4 text-[#d4af37] font-bold">-{c.credite_consumate} cr.</td>
                        <td className="p-4 text-zinc-400 text-xs">
                          {c.data_conversie ? new Date(c.data_conversie).toLocaleString('ro-RO') : '-'}
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => setPreviewAiModal({ open: true, item: c })}
                            className="bg-zinc-800 hover:bg-[#d4af37] hover:text-black text-white px-3 py-1.5 rounded text-xs font-bold transition cursor-pointer"
                          >
                            👁️ Citește textul
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: TRANZACTII SAAS ==================== */}
        {activeTab === 'transactions' && (
          <div>
            <h2 className="text-xl font-serif text-white mb-4">Registru Plăți & Upgrade-uri Abonament (tranzactii_simulate)</h2>
            <div className="bg-[#121215] border border-zinc-800 rounded-xl overflow-x-auto">
              {tranzactii.length === 0 ? (
                <div className="p-8 text-zinc-400 text-sm">
                  Nu există încă tranzacții înregistrate. Când un preot face upgrade la abonament din contul lui, tranzacția apare automat aici.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1c1917] text-[#d4af37] text-xs uppercase">
                      <th className="p-4">ID Tranzacție</th>
                      <th className="p-4">Parohie</th>
                      <th className="p-4">Plan Achiziționat</th>
                      <th className="p-4">Sumă</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tranzactii.map((t) => (
                      <tr key={t.id_tranzactie} className="border-t border-zinc-800 hover:bg-[#d4af37]/5">
                        <td className="p-4 text-zinc-400">#{t.id_tranzactie}</td>
                        <td className="p-4 font-bold">{t.utilizatori?.email_utilizator || `User #${t.id_utilizator}`}</td>
                        <td className="p-4">{t.abonamente?.nume_plan || '-'}</td>
                        <td className="p-4 text-emerald-400 font-black">{t.suma_simulata} RON</td>
                        <td className="p-4">
                          <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded text-xs font-bold">
                            {t.status_tranzactie || 'FINALIZATA'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODALE ==================== */}

      {/* 1. MODAL INROLARE */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleCreateUser} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-[#fef08a]">Înrolare Parohie / Cont Nou</h3>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Email Acces:</label>
              <input
                type="email"
                required
                value={newUser.email_utilizator}
                onChange={(e) => setNewUser({ ...newUser, email_utilizator: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                placeholder="parohia@biserica.ro"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Parolă:</label>
              <input
                type="text"
                required
                value={newUser.parola_hash}
                onChange={(e) => setNewUser({ ...newUser, parola_hash: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300 font-semibold">Credite AI:</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newUser.credite_disponibile}
                  onChange={(e) => setNewUser({ ...newUser, credite_disponibile: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Plan Abonament:</label>
              <select
                value={newUser.id_abonament}
                onChange={(e) => setNewUser({ ...newUser, id_abonament: Number(e.target.value) })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              >
                {plans.map((p) => (
                  <option key={p.id_abonament} value={p.id_abonament}>
                    {p.nume_plan}
                  </option>
                ))}
              </select>
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

      {/* 2. MODAL EDITARE CONT COMPLET */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdateUser} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-[#fef08a]">Editare Cont #{editModal.id_utilizator}</h3>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Email:</label>
              <input
                type="email"
                required
                value={editModal.email_utilizator}
                onChange={(e) => setEditModal({ ...editModal, email_utilizator: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Parolă Nouă (lasă gol dacă nu o schimbi):</label>
              <input
                type="text"
                value={editModal.parola_hash}
                onChange={(e) => setEditModal({ ...editModal, parola_hash: e.target.value })}
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-zinc-300 font-semibold">Rol:</label>
                <select
                  value={editModal.rol_utilizator}
                  onChange={(e) => setEditModal({ ...editModal, rol_utilizator: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300 font-semibold">Credite AI:</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editModal.credite_disponibile}
                  onChange={(e) => setEditModal({ ...editModal, credite_disponibile: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Plan Abonament:</label>
              <select
                value={editModal.id_abonament}
                onChange={(e) => setEditModal({ ...editModal, id_abonament: Number(e.target.value) })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              >
                {plans.map((p) => (
                  <option key={p.id_abonament} value={p.id_abonament}>
                    {p.nume_plan}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3 rounded-lg uppercase text-sm cursor-pointer">
                Salvează Modificările
              </button>
              <button type="button" onClick={() => setEditModal({ ...editModal, open: false })} className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. MODAL CREDITE */}
      {creditModal.open && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAddCredits} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-[#fef08a]">Alimentare Credite AI</h3>
            <p className="text-zinc-400 text-sm">
              Cont: <strong className="text-white">{creditModal.email}</strong> (Sold curent: <span className="text-[#d4af37] font-bold">{creditModal.credits}</span>)
            </p>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border cursor-pointer ${
                    Number(amount) === preset ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              className="w-full p-3.5 rounded-lg bg-[#09090b] border border-[#d4af37] text-white text-lg font-bold"
            />
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

      {/* 4. MODAL PREVIZUALIZARE TEXT AI */}
      {previewAiModal.open && previewAiModal.item && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-xl font-serif font-bold text-[#fef08a]">
                Text Generat #{previewAiModal.item.id_conversie} ({previewAiModal.item.tip_conversie})
              </h3>
              <button
                type="button"
                onClick={() => setPreviewAiModal({ open: false, item: null })}
                className="text-zinc-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-zinc-400">
              <strong>Prompt / Temă:</strong> {previewAiModal.item.prompt_input}
            </div>
            <div className="bg-[#09090b] border border-zinc-800 p-4 rounded-xl text-zinc-200 text-sm whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto">
              {previewAiModal.item.rezultat_output}
            </div>
            <button
              type="button"
              onClick={() => setPreviewAiModal({ open: false, item: null })}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Închide
            </button>
          </div>
        </div>
      )}

      {/* 5. MODAL EDITARE PLAN ABONAMENT */}
      {editPlanModal.open && editPlanModal.plan && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdatePlan} className="bg-[#121215] border-2 border-[#d4af37] p-7 rounded-2xl w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-[#fef08a]">Editare {editPlanModal.plan.nume_plan}</h3>
            <div>
              <label className="block text-sm mb-1 text-zinc-300 font-semibold">Nume Plan:</label>
              <input
                type="text"
                required
                value={editPlanModal.plan.nume_plan}
                onChange={(e) => setEditPlanModal({ ...editPlanModal, plan: { ...editPlanModal.plan, nume_plan: e.target.value } })}
                className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-zinc-300 font-semibold">Preț Lunar (RON):</label>
                <input
                  type="number"
                  min="0"
                  value={editPlanModal.plan.pret_simulat ?? 0}
                  onChange={(e) => setEditPlanModal({ ...editPlanModal, plan: { ...editPlanModal.plan, pret_simulat: Number(e.target.value) } })}
                  className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300 font-semibold">Credite Incluse:</label>
                <input
                  type="number"
                  min="0"
                  value={editPlanModal.plan.credite_lunare ?? 0}
                  onChange={(e) => setEditPlanModal({ ...editPlanModal, plan: { ...editPlanModal.plan, credite_lunare: Number(e.target.value) } })}
                  className="w-full p-3 rounded-lg bg-[#09090b] border border-zinc-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-black py-3 rounded-lg uppercase text-sm cursor-pointer">
                Salvează Planul
              </button>
              <button type="button" onClick={() => setEditPlanModal({ open: false, plan: null })} className="flex-1 bg-zinc-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer">
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
