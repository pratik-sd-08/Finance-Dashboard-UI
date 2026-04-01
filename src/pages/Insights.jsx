import { useMemo } from "react";
import { getCat, MONTHS } from "../data/mockData";

const fmt = (n) =>
  "₹" + Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function Insights({ transactions }) {
  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income");

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0;

  const catMap = useMemo(() => {
    const m = {};
    expenses.forEach((t) => { m[t.category] = (m[t.category] || 0) + t.amount; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const topCat = catMap[0];

  const monthlyExpense = useMemo(() => {
    return MONTHS.map((month, mi) => {
      const monthNum = mi + 1;
      const total = expenses
        .filter((t) => new Date(t.date).getMonth() + 1 === monthNum)
        .reduce((s, t) => s + t.amount, 0);
      return { month, total };
    });
  }, [expenses]);

  const maxMonth = Math.max(...monthlyExpense.map((m) => m.total), 1);

  const monthlyIncome = useMemo(() => {
    return MONTHS.map((month, mi) => {
      const monthNum = mi + 1;
      const total = income
        .filter((t) => new Date(t.date).getMonth() + 1 === monthNum)
        .reduce((s, t) => s + t.amount, 0);
      return { month, total };
    });
  }, [income]);

  const avgMonthlyExpense = (monthlyExpense.reduce((s, m) => s + m.total, 0) / MONTHS.length).toFixed(0);

  const catColors = ["#c8521a", "#3b82f6", "#8b5cf6", "#ec4899", "#10b981"];

  return (
    <div>
      <div className="page-header">
        <h2>Insights</h2>
        <p>Patterns and observations from your financial activity</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <h3>Top Spending Category</h3>
          {topCat ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{getCat(topCat[0]).icon}</span>
                <div>
                  <div className="insight-big">{topCat[0]}</div>
                  <div className="insight-sub">{fmt(topCat[1])} spent total</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>All categories</div>
                {catMap.slice(0, 5).map(([cat, val], i) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, width: 20 }}>{getCat(cat).icon}</span>
                    <div style={{ flex: 1, height: 6, background: "var(--bg2)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(val / catMap[0][1]) * 100}%`,
                        background: catColors[i] || "var(--accent)",
                        borderRadius: 3,
                        transition: "width 0.6s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text2)", width: 70, textAlign: "right" }}>{fmt(val)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state"><p>No expense data yet.</p></div>
          )}
        </div>

        <div className="insight-card">
          <h3>Savings Rate</h3>
          <div className="insight-big" style={{ color: savings >= 0 ? "var(--green)" : "var(--red)" }}>
            {savingsRate}%
          </div>
          <div className="insight-sub">
            {savings >= 0 ? `You're saving ${fmt(savings)}` : `Over budget by ${fmt(Math.abs(savings))}`}
          </div>
          <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--bg2)", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Income</span>
              <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--green)" }}>{fmt(totalIncome)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Expenses</span>
              <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--red)" }}>{fmt(totalExpense)}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Net saved</span>
              <span style={{ fontSize: 13, fontFamily: "var(--font-head)", fontWeight: 700, color: savings >= 0 ? "var(--green)" : "var(--red)" }}>{fmt(savings)}</span>
            </div>
          </div>
        </div>

        <div className="insight-card">
          <h3>Monthly Expense Comparison</h3>
          <div className="month-compare-row">
            {monthlyExpense.map((m) => (
              <div className="month-row-item" key={m.month}>
                <span className="month-name">{m.month}</span>
                <div className="month-bar-track">
                  <div
                    className="month-bar-fill"
                    style={{ width: `${(m.total / maxMonth) * 100}%`, background: "var(--red)" }}
                  />
                </div>
                <span className="month-amt">{fmt(m.total)}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "8px 12px", background: "var(--accent-soft)", borderRadius: 7 }}>
            <span style={{ fontSize: 12, color: "var(--accent)" }}>
              Avg monthly spend: <strong>{fmt(avgMonthlyExpense)}</strong>
            </span>
          </div>
        </div>

        <div className="insight-card">
          <h3>Monthly Income Breakdown</h3>
          <div className="month-compare-row">
            {monthlyIncome.map((m) => {
              const maxInc = Math.max(...monthlyIncome.map((x) => x.total), 1);
              return (
                <div className="month-row-item" key={m.month}>
                  <span className="month-name">{m.month}</span>
                  <div className="month-bar-track">
                    <div
                      className="month-bar-fill"
                      style={{ width: `${(m.total / maxInc) * 100}%`, background: "var(--green)" }}
                    />
                  </div>
                  <span className="month-amt">{fmt(m.total)}</span>
                </div>
              );
            })}
          </div>

          {expenses.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 8 }}>
                Quick Observations
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                {catMap[0] && `• ${catMap[0][0]} is your biggest expense category.`}<br />
                {savings > 0
                  ? `• You retained ${savingsRate}% of your income — good discipline.`
                  : "• Expenses exceeded income this period — worth reviewing."}
                <br />
                {monthlyExpense[2]?.total > monthlyExpense[1]?.total
                  ? "• March spending went up compared to February."
                  : "• March spending was lower than February — nice."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
