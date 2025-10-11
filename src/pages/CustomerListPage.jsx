import React, { useState, useEffect, useRef } from "react";
import {
  getAllCustomers,
  searchCustomers,
  filterCustomers,
  deleteCustomer,
  getCustomerStats,
} from "../services/CustomerService";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaEdit, FaPrint, FaSearchMinus, FaSearchPlus, FaUndo } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useDebounce } from "../hooks/useDebounce";
import { TableSkeleton } from "../components/LoadingSkeleton";
import { MdDeleteForever } from "react-icons/md";
import "./CustomerListPage.css";


const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ loantype: "", month: "", year: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: "" });
  const [deleting, setDeleting] = useState(false);
  const debounceSearch = useDebounce(search, 400);
  const pollingRef = useRef(null);

  // Zoom state: default 1.0, min 0.6, max 1.6
  const [zoom, setZoom] = useState(1);

  // Detect mobile to hide buttons and enable pinch-to-zoom-out only
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pinch handling refs
  const pinchRef = useRef({ startDist: null, startZoom: null, inPinch: false });

  const getDistance = (t1, t2) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    if (e.touches && e.touches.length === 2) {
      const d = getDistance(e.touches[0], e.touches[1]);
      pinchRef.current = { startDist: d, startZoom: zoom, inPinch: true };
    }
  };

  const handleTouchMove = (e) => {
    if (!isMobile) return;
    if (!pinchRef.current.inPinch) return;
    if (e.touches && e.touches.length === 2) {
      const d = getDistance(e.touches[0], e.touches[1]);
      const scale = d / pinchRef.current.startDist;
      // Only allow zoom out on mobile (scale < 1)
      if (scale < 1) {
        const newZoom = Math.max(0.4, +(pinchRef.current.startZoom * scale).toFixed(2));
        setZoom(newZoom);
      }
      // prevent page pinch-zoom behavior when performing pinch on table
      e.preventDefault?.();
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    // reset pinch state when touches drop below 2
    if (!e.touches || e.touches.length < 2) {
      pinchRef.current = { startDist: null, startZoom: null, inPinch: false };
    }
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await getAllCustomers();
      const data = res?.data?.customers ?? res?.data ?? [];
      setCustomers(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await getCustomerStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const handleSearch = async (value = search) => {
    try {
      setLoading(true);
      if (value.trim()) {
        const res = await searchCustomers(value);
        const data = res?.data?.customers ?? res?.data ?? [];
        setCustomers(data);
      } else {
        await loadCustomers();
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const res = await filterCustomers(filters);
      const data = res?.data?.customers ?? res?.data ?? [];
      setCustomers(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Filter failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger debounced search automatically when user types
  useEffect(() => {
    if (debounceSearch === undefined) return;
    (async () => {
      if (debounceSearch.trim()) {
        await handleSearch(debounceSearch);
      } else {
        const hasFilters = Object.values(filters).some((v) => v !== "");
        if (!hasFilters) await loadCustomers();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch]);

  // Poll for updates every 30s when not searching or filtering
  useEffect(() => {
    const isFiltering = Object.values(filters).some((v) => v !== "");
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (!search.trim() && !isFiltering) {
      pollingRef.current = setInterval(() => {
        loadCustomers();
      }, 60000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Pending</span>;
    }
  };

  const promptDelete = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget.id) return;
    setDeleting(true);
    try {
      await deleteCustomer(deleteTarget.id);
      setMessage("✅ Customer deleted successfully.");
      setMessageType("success");
      // Refresh the list
      await loadCustomers();
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("❌ Failed to delete customer. Please try again.");
      setMessageType("danger");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteTarget({ id: null, name: "" });
      // Clear message after a short delay
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Zoom controls (desktop only)
  const zoomIn = () => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)));
  const resetZoom = () => setZoom(1);
  const handleZoomChange = (e) => setZoom(Number(e.target.value));

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline border-none d-flex align-items-center gap-1" onClick={handleLogout}>
          <CiLogout size={22} />
        </button>

        

        <div className="d-flex gap-2 align-items-center">
          {lastUpdated && <small className="text-muted me-2">Last updated: {lastUpdated.toLocaleTimeString()}</small>}
          <button className="btn btn-outline-d d-flex align-items-center gap-1" onClick={() => window.print()}>
            <FaPrint size={16} /> Print
          </button>

          {/* Desktop zoom controls only */}
          {!isMobile && (
            <div className="d-flex align-items-center ms-2">
              <button className="btn btn-sm btn-light me-1" title="Zoom out" onClick={zoomOut}><FaSearchMinus /></button>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.01"
                value={zoom}
                onChange={handleZoomChange}
                style={{ width: 120 }}
                aria-label="Table zoom"
                className="form-range"
              />
              <button className="btn btn-sm btn-light ms-1 me-2" title="Zoom in" onClick={zoomIn}><FaSearchPlus /></button>
              <button className="btn btn-sm btn-outline-secondary" title="Reset zoom" onClick={resetZoom}><FaUndo /></button>
              <small className="text-muted ms-2" style={{ minWidth: 48, textAlign: "right" }}>{Math.round(zoom * 100)}%</small>
            </div>
          )}
        </div>
      </div>
      <h2 className="mb-2 text-center flex-grow-1">Dashboard</h2>

      {/* Search + Filter Row */}
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md-8 mb-2 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="btn btn-primary" onClick={() => handleSearch()}>
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="col-12 col-md-4 text-md-end">
          <button
            className="btn btn-outline-dark d-flex align-items-center gap-2 w-100 w-md-auto"
            onClick={() => setShowFilters((s) => !s)}
          >
            <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-3 mb-4 shadow-sm">
          <h5 className="mb-3">Filter Options</h5>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <select className="form-select" value={filters.loantype} onChange={(e) => setFilters({ ...filters, loantype: e.target.value })}>
                <option value="">All Loan Types</option>
                <option value="home">Home</option>
                <option value="mortgage">Mortgage</option>
              </select>
            </div>

            <div className="col-md-3 col-6">
              <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-2 col-6">
              <input type="number" placeholder="Month" min="1" max="12" className="form-control" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} />
            </div>

            <div className="col-md-2 col-6">
              <input type="number" placeholder="Year" className="form-control" value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
            </div>

            <div className="col-md-2 col-12">
              <button className="btn btn-secondary w-100" onClick={handleFilter} disabled={loading}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview toggle */}
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-outline-primary" style={{ borderRadius: 8, fontWeight: 500 }} onClick={() => setShowStats((s) => !s)}>
          {showStats ? "Hide Overview" : "Show Overview"}
        </button>
      </div>

      {/* Stats */}
      {showStats && stats && (
          <div className="stats-container mb-4">
            {[
              { label: "Approved", value: stats.approvedCount, color: "#28a745" },
              { label: "Pending", value: stats.pendingCount, color: "#ffc107" },
              { label: "Rejected", value: stats.rejectedCount, color: "#dc3545" },
              {
                label: "Total Loans",
                value: `₹${stats.totalLoanAmount.toLocaleString()}`,
                color: "#6f42c1",
              },
            ].map((item, i) => (
              <div key={i} className="stat-card">
                <div className="stat-label">{item.label}</div>
                <div className="stat-value" style={{ color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}


      {/* Customer Table */}
      <div className="table-responsive print-section">
        {loading ? (
          <TableSkeleton rows={8} columns={9} />
        ) : (
          // Zoom wrapper: scale the table while keeping it scrollable
          <div
            className="table-zoom-wrapper"
            style={{ overflow: "auto" }}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            <div
              className="table-zoom-content"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "0 0",
                width: `${100 / zoom}%`,
              }}
            >
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Bank</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="no-print">Action</th>
                    <th className="no-print">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((c, index) => (
                      <tr key={c._id}>
                        <td>{index + 1}</td>
                        <td>{c.firstname} {c.lastname}</td>
                        <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</td>
                        <td>{c.phone}</td>
                        <td className="text-capitalize">{c.loantype}</td>
                        <td>{c.bankname}</td>
                        <td>₹ {c.loanamount?.toLocaleString()}</td>
                        <td>{renderStatusBadge(c.status)}</td>
                        <td className="no-print text-center">
                          <Link to={`/profile/update/${c._id}`} className="btn btn-sm">
                            <FaEdit className="me-1" /> Edit
                          </Link>
                        </td>
                        <td className="no-print text-center">
                          <button className="btn btn-sm text-danger" onClick={() => promptDelete(c._id, `${c.firstname} ${c.lastname}`)}><MdDeleteForever size={18}/></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted py-4">No customers found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inline message */}
      {message && (
        <div className={`alert alert-${messageType} mt-3 text-center`} role="alert">
          {message}
        </div>
      )}

      {/* Delete Confirmation Modal (Bootstrap classes) */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex={-1} role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>?</p>
                <p className="text-danger small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
                  {deleting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Deleting...</>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerListPage;