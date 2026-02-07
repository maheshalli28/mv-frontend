import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaFilter, FaEdit, FaChevronLeft, FaChevronRight, FaUserPlus, FaTimes, FaTrash } from "react-icons/fa";
import {
  useCustomers,
  useCustomerStats,
  useSearchCustomers,
  useFilterCustomers,
  useDeleteCustomer,
} from "../services/CustomerService";
import { TableSkeleton, StatsSkeleton } from "../components/LoadingSkeleton";
import { useDebounce } from "../hooks/useDebounce";
import CustomerRegisterPage from "./CustomerRegisterPage";

const statBoxStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  padding: "1.5rem 1rem",
  minWidth: 140,
  textAlign: "center",
  margin: "0.5rem",
};

const CustomerListPageOptimized = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subAdminIdParam = queryParams.get("subAdminId") || "";

  const [filters, setFilters] = useState({
    loantype: "",
    month: "",
    year: "",
    status: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);
  const isSearching = debouncedSearch.length > 2;
  const isFiltering = Object.values(filters).some((v) => v !== "");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isSuperAdmin = user.role === "super-admin";
  const isSubAdmin = user.role === "sub-admin";

  // --- React Query Hooks ---
  const { data: customersData, isLoading: customersLoading, refetch: refetchCustomers } =
    useCustomers(page, 20, sortBy, sortOrder, subAdminIdParam);

  const { data: statsData, isLoading: statsLoading } = useCustomerStats();
  const { data: searchData } = useSearchCustomers(debouncedSearch, isSearching);
  const { data: filterData } = useFilterCustomers(filters);

  const deleteCustomerMutation = useDeleteCustomer();

  // --- Decide which data to display ---
  const displayData = useMemo(() => {
    if (isSearching && searchData?.data?.length > 0) return searchData.data;
    if (isFiltering && filterData?.data?.length > 0) return filterData.data;
    if (customersData?.data?.customers?.length > 0) return customersData.data.customers;
    return [];
  }, [isSearching, isFiltering, searchData, filterData, customersData]);

  const pagination = useMemo(() => {
    if (isSearching || isFiltering) return null;
    return customersData?.data?.pagination;
  }, [isSearching, isFiltering, customersData]);

  const handleDelete = async (id) => {
    if (!isSuperAdmin) return;
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomerMutation.mutateAsync(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  const renderStatusBadge = (status) => {
    const statusColors = { approved: "success", pending: "warning", rejected: "danger" };
    return <span className={`badge bg-${statusColors[status] || "secondary"}`}>{status?.toUpperCase()}</span>;
  };

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Customer Management</h2>
        </div>
        <div className="d-flex gap-2">
          {isSuperAdmin && (
            <Link to="/admin/sub-admins" className="btn btn-primary">
              Manage Sub-Admins
            </Link>
          )}
        </div>

      </div>

      {/* Dashboard Header with Add Customer Button */}
      <div className="dashboard-header mb-4 p-4 bg-white rounded-4 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              {isSubAdmin ? "Assigned Customers" : "Global Overview"}
            </h2>
            <p className="text-muted mb-0 ">
              {isSubAdmin ? `Welcome back ${user.name}, ` : `Managing all platform records`}
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn ${showAddForm ? 'btn-danger' : 'btn-success'} d-flex align-items-center gap-2 px-4 shadow-sm fw-bold`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? <FaTimes /> : <FaUserPlus />}
              {showAddForm ? "Close Form" : "Add Customer"}
            </button>

          </div>
        </div>
      </div>

      {/* Add Customer Form Overlay */}
      {showAddForm && (
        <CustomerRegisterPage onClose={() => setShowAddForm(false)} />
      )}

      {/* Stats */}
      <div className="dashboard-stats mb-4">
        {statsLoading ? (
          <StatsSkeleton count={4} />
        ) : (
          <div className="row g-3">
            <div className="col-md-3">
              <div style={statBoxStyle}>
                <h6 className="text-muted">{isSubAdmin ? "My Total" : "Total Customers"}</h6>
                <h3 className="fw-bold">{statsData?.data?.totalCustomers || 0}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div style={statBoxStyle}>
                <h6 className="text-muted">Approved</h6>
                <h3 className="text-success">{statsData?.data?.approvedCount || 0}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div style={statBoxStyle}>
                <h6 className="text-muted">Pending</h6>
                <h3 className="text-warning">{statsData?.data?.pendingCount || 0}</h3>
              </div>
            </div>
            <div className="col-md-3">
              <div style={statBoxStyle}>
                <h6 className="text-muted">Total Loan Amount</h6>
                <h3 className="text-info">
                  ₹{statsData?.data?.totalLoanAmount?.toLocaleString() || 0}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search + Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary">
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-outline-info" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filters.loantype}
                  onChange={(e) => setFilters({ ...filters, loantype: e.target.value })}
                >
                  <option value="">All Loan Types</option>
                  <option value="home">Home Loan</option>
                  <option value="mortgage">Mortgage Loan</option>
                  <option value="other">Other Loan</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Year"
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Month"
                  min="1"
                  max="12"
                  value={filters.month}
                  onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button className="btn btn-primary w-100" onClick={() => refetchCustomers()}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Table */}
      <div className="card">
        <div className="card-body">
          {customersLoading && !isSearching && !isFiltering ? (
            <TableSkeleton rows={10} columns={7} />
          ) : displayData.length === 0 ? (
            <p className="text-center">No customers found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("firstname")} style={{ cursor: "pointer" }}>
                        Name {sortBy === "firstname" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th className="d-none d-md-table-cell">Email</th>
                      <th>Phone</th>
                      <th>IFSC Code</th>
                      <th>Account No.</th>
                      <th>Loan Type</th>
                      <th onClick={() => handleSort("loanamount")} style={{ cursor: "pointer" }}>
                        Amount {sortBy === "loanamount" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("status")} style={{ cursor: "pointer" }}>
                        Status {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                      </th>
                      {isSuperAdmin && <th>Assigned To</th>}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.map((customer) => (
                      <tr key={customer._id}>
                        <td>
                          <div className="fw-bold">{customer.firstname} {customer.lastname}</div>
                          <div className="small text-muted d-md-none">{customer.email}</div>
                        </td>
                        <td className="d-none d-md-table-cell">{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.ifsccode}</td>
                        <td>{customer.accountnumber}</td>
                        <td>{customer.loantype}</td>
                        <td>₹{customer.loanamount?.toLocaleString()}</td>
                        <td>{renderStatusBadge(customer.status)}</td>
                        {isSuperAdmin && (
                          <td>
                            <span className="badge bg-light text-dark border">
                              {customer.subAdminId?.username || "Direct"}
                            </span>
                          </td>
                        )}
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/profile/${customer._id}`)}
                              title="View Details"
                            >
                              View
                            </button>
                            {isSuperAdmin && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => navigate(`/profile/update/${customer._id}`)}
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(customer._id)}
                                  title="Delete"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {page * pagination.limit - pagination.limit + 1} to{" "}
                    {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} customers
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <FaChevronLeft /> Previous
                    </button>
                    <span className="btn btn-outline-secondary">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerListPageOptimized;
