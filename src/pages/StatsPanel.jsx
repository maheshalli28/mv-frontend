import React, { useState, useEffect } from "react";

/**
 * Props:
 * - customers: array of customer objects (uses createdAt, status, loanamount)
 * - overallStats: object with approvedCount, pendingCount, rejectedCount, totalLoanAmount (optional)
 * - initialMonth, initialYear: numbers (1-12, 4-digit year) optional
 *
 * Usage:
 * import StatsPanel from "../components/StatsPanel";
 * <StatsPanel customers={customers} overallStats={stats} />
 */

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const StatsPanel = ({ customers = [], overallStats = null, initialMonth, initialYear }) => {
  const now = new Date();
  const defaultMonth = initialMonth || now.getMonth() + 1;
  const defaultYear = initialYear || now.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [monthlyStats, setMonthlyStats] = useState(null);

  const computeMonthlyStats = (month, year) => {
    if (!customers || customers.length === 0) {
      return { registrations: 0, approvedCount: 0, pendingCount: 0, rejectedCount: 0, totalLoanAmount: 0 };
    }
    const monthIndex = Number(month); // 1-12
    const filtered = customers.filter((c) => {
      const d = c.createdAt ? new Date(c.createdAt) : null;
      if (!d || Number.isNaN(d.getTime())) return false;
      return d.getMonth() + 1 === monthIndex && d.getFullYear() === Number(year);
    });

    const registrations = filtered.length;
    let approvedCount = 0, pendingCount = 0, rejectedCount = 0;
    let totalLoanAmount = 0;
    filtered.forEach((c) => {
      const status = (c.status || "").toLowerCase();
      if (status === "approved") approvedCount++;
      else if (status === "rejected") rejectedCount++;
      else pendingCount++;
      totalLoanAmount += Number(c.loanamount) || 0;
    });

    return { registrations, approvedCount, pendingCount, rejectedCount, totalLoanAmount };
  };

  useEffect(() => {
    const computed = computeMonthlyStats(selectedMonth, selectedYear);
    setMonthlyStats(computed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers, selectedMonth, selectedYear]);

  // build year options from data (include defaultYear)
  const yearOptions = (() => {
    const years = new Set(
      customers
        .map((c) => (c.createdAt ? new Date(c.createdAt).getFullYear() : null))
        .filter(Boolean)
    );
    years.add(defaultYear);
    return Array.from(years).sort((a, b) => b - a);
  })();

  return (
    <div className="mb-4">
      <div className="card p-3 mb-3 shadow-sm">
         <h5 className="mb-2 me-3">Monthly Overview</h5>
        <div className="d-flex align-items-center mb-3">
         
          <div className="d-flex gap-2 align-items-center">
            <select
              className="form-select form-select-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={{ width: 120 }}
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>{m}</option>
              ))}
            </select>

            <select
              className="form-select form-select-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={{ width: 110 }}
            >
              {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => { setSelectedMonth(defaultMonth); setSelectedYear(defaultYear); }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="stats-container justify-content-between m-b-3">
          {monthlyStats ? (
            [
              { label: "Registrations", value: monthlyStats.registrations, color: "#007bff" },
              { label: "Approved", value: monthlyStats.approvedCount, color: "#28a745" },
              { label: "Pending", value: monthlyStats.pendingCount, color: "#ffc107" },
              { label: "Rejected", value: monthlyStats.rejectedCount, color: "#dc3545" },
              { label: "Total Loans", value: `₹${monthlyStats.totalLoanAmount.toLocaleString()}`, color: "#6f42c1" },
            ].map((item, i) => (
              <div key={i} className="stat-card">
                <div className="d-flex flex-column align-items-center">
                   <span className="stat-value" style={{ color: item.color }}>{item.label} : {item.value}</span>
                </div>
                
              </div>
            ))
          ) : (
            <div className="text-muted">No data for selected month.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;