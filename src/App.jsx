import { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import { transactions as initialTxns } from "./data/mockData";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [role, setRole] = useState("viewer");
  const [transactions, setTransactions] = useState(initialTxns);
  const [filters, setFilters] = useState({ type: "all", category: "all", search: "" });
  const [darkMode, setDarkMode] = useState(false);

  const addTransaction = (txn) => {
    setTransactions((prev) => [{ ...txn, id: Date.now() }, ...prev]);
  };

  const editTransaction = (id, updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  return (
    <div className={`app-shell ${darkMode ? "dark" : ""}`}>
      <Sidebar
        page={page}
        setPage={setPage}
        role={role}
        setRole={setRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <main className="main-content">
        {page === "dashboard" && (
          <Dashboard transactions={transactions} role={role} />
        )}
        {page === "transactions" && (
          <Transactions
            transactions={transactions}
            filters={filters}
            setFilters={setFilters}
            role={role}
            onAdd={addTransaction}
            onEdit={editTransaction}
          />
        )}
        {page === "insights" && (
          <Insights transactions={transactions} />
        )}
      </main>
    </div>
  );
}
