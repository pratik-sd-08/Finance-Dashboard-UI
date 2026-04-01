import { useMemo } from "react";
import { getCat, MONTHS } from "../data/mockData";

const fmt = (n) =>
  "₹" + Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 120;
  const r = 44;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const slices = data.map((d) => {
    const pct = d.value / total;
    const dash = pct * circumference;
    const slice = { ...d, pct, dash, offset };
    offset += dash;
    return slice;
  });

  return (
    <div className="donut-wrap">
      <svg width={size} height={size} className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg2)" strokeWidth="18" />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="18"
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset + circumference * 0.25}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
        <text x={cx} y={cy - 5} textAnchor="middle" fontSize="11" fill="var(--text3)" fontFamily="var(--font-mono)">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)" fontFamily="var(--font-head)">{fmt(total)}</text>
      </svg>
      <div className="cat-legend">
        {slices.map((s, i) => (
          <div className="cat-legend-item" key={i}>
            <div className="cat-legend-left">
              <div className="cat-dot" style={{ background: s.color }} />
              <span>{s.name}</span>
            </div>
            <span className="cat-pct">{(s.pct * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ transactions, role }) {
  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const monthlyData = useMemo(() => {
    return MONTHS.map((month, mi) => {
      const year = 2026;
      const monthNum = mi + 1;
      const relevant = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() + 1 === monthNum;
      });
      const income = relevant.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = relevant.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { month, income, expense };
    });
  }, [transactions]);

  const maxBar = Math.max(...monthlyData.flatMap((m) => [m.income, m.expense]));

  const catSpend = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value, color: getCat(name).color }));
  }, [transactions]);

  const recent = transactions.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h2>Overview</h2>
        <p>Your financial summary at a glance{role === "admin" ? " — Admin view" : ""}</p>
      </div>

      <div className="cards-row">
        <div className="summary-card card-balance">
          <div className="card-label">Net Balance</div>
          <div className="card-value">{fmt(stats.balance)}</div>
          <div className="card-sub">income − expenses</div>
          <div className="card-icon">◎</div>
        </div>
        <div className="summary-card card-income">
          <div className="card-label">Total Income</div>
          <div className="card-value">{fmt(stats.income)}</div>
          <div className="card-sub">across all sources</div>
          <div className="card-icon">↑</div>
        </div>
        <div className="summary-card card-expense">
          <div className="card-label">Total Expenses</div>
          <div className="card-value">{fmt(stats.expenses)}</div>
          <div className="card-sub">this period</div>
          <div className="card-icon">↓</div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Monthly Trend — Jan to Mar 2026</h3>
          <div className="bar-chart">
            {monthlyData.map((m) => (
              <div className="bar-group" key={m.month}>
                <div className="bar-stacks">
                  <div
                    className="bar income-bar"
                    title={`Income: ${fmt(m.income)}`}
                    style={{ height: `${maxBar ? (m.income / maxBar) * 110 : 0}px` }}
                  />
                  <div
                    className="bar expense-bar"
                    title={`Expense: ${fmt(m.expense)}`}
                    style={{ height: `${maxBar ? (m.expense / maxBar) * 110 : 0}px` }}
                  />
                </div>
                <div className="bar-label">{m.month}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span><span className="legend-dot" style={{ background: "var(--green)" }} />Income</span>
            <span><span className="legend-dot" style={{ background: "var(--red)" }} />Expense</span>
          </div>
        </div>

        <div className="chart-card">
          <h3>Spending by Category</h3>
          {catSpend.length > 0 ? (
            <DonutChart data={catSpend} />
          ) : (
            <div className="empty-state">No expense data</div>
          )}
        </div>
      </div>

      <div className="recent-txns">
        <h3>Recent Transactions</h3>
        {recent.length === 0 ? (
          <div className="empty-state"><p>No transactions yet.</p></div>
        ) : (
          recent.map((t) => {
            const cat = getCat(t.category);
            return (
              <div className="txn-row" key={t.id}>
                <div className="txn-icon" style={{ background: cat.color + "22" }}>
                  {cat.icon}
                </div>
                <div className="txn-info">
                  <div className="txn-name">{t.name}</div>
                  <div className="txn-meta">{t.date} · {t.category}</div>
                </div>
                <div className={`txn-amount ${t.type}`}>
                  {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
