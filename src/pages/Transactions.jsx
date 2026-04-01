import { useState, useMemo } from "react";
import { categories, getCat } from "../data/mockData";

const fmt = (n) =>
  "₹" + Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const EMPTY_FORM = {
  name: "", amount: "", date: "", category: "Food", type: "expense",
};

function TxnModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.amount || !form.date) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initial?.id ? "Edit Transaction" : "Add Transaction"}</h3>

        <div className="form-field">
          <label>Description</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Netflix subscription" />
        </div>
        <div className="form-field">
          <label>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" />
        </div>
        <div className="form-field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions({ transactions, filters, setFilters, role, onAdd, onEdit }) {
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [modal, setModal] = useState(null); // null | "add" | txn object

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filters.type !== "all") list = list.filter((t) => t.type === filters.type);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (sort.key === "amount") { av = +av; bv = +bv; }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [transactions, filters, sort]);

  const toggleSort = (key) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "asc" ? "desc" : "asc" }));
  };

  const sortIcon = (key) => {
    if (sort.key !== key) return " ↕";
    return sort.dir === "asc" ? " ↑" : " ↓";
  };

  const handleSave = (data) => {
    if (data.id) { onEdit(data.id, data); }
    else { onAdd(data); }
    setModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Transactions</h2>
        <p>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""} found
          {role === "admin" && " — you can add and edit entries"}
        </p>
      </div>

      <div className="txn-controls">
        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </div>

        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        {role === "admin" && (
          <button className="btn-primary" onClick={() => setModal("add")}>+ Add</button>
        )}
      </div>

      <div className="txn-table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 28 }}>📭</div>
            <p>No transactions match your filters.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort("date")}>Date{sortIcon("date")}</th>
                <th onClick={() => toggleSort("name")}>Description{sortIcon("name")}</th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => toggleSort("amount")}>Amount{sortIcon("amount")}</th>
                {role === "admin" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const cat = getCat(t.category);
                return (
                  <tr key={t.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>{t.date}</td>
                    <td style={{ fontWeight: 500 }}>{t.name}</td>
                    <td>
                      <span className="cat-badge" style={{ background: cat.color + "20", color: cat.color }}>
                        {cat.icon} {t.category}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge type-${t.type}`}>
                        {t.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "var(--font-head)", fontWeight: 600, color: t.type === "income" ? "var(--green)" : "var(--red)" }}>
                        {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td>
                        <button className="edit-btn" onClick={() => setModal(t)}>Edit</button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <TxnModal
          initial={modal === "add" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
