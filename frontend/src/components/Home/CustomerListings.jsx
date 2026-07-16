import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { SiWhatsapp } from 'react-icons/si';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { statusList } from '../../data/statusList';
import { tableHeader } from '../../data/tableHeader';

const PAGE_SIZE = 10;

const tableVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const BADGE_COLORS = {
  Completed: 'bg-success-icon text-white',
  Booking: 'bg-success-icon text-white',
  Appointment: 'bg-info-icon text-white',
  'Pending Appointment': 'bg-warning-icon text-white',
  WhatsApp: 'badge-primary',
  'Might Keep In Touch': 'bg-secondary-icon text-white',
  'Not Yet Call': 'badge-neutral',
  'No Pickup': 'badge-ghost',
  'Not Interested': 'bg-error-icon text-white',
  'Stop Following Up': 'bg-error-icon text-white',
};

const getBadgeClass = (status) => BADGE_COLORS[status] || 'badge-ghost';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

function LoadingSkeleton() {
  return (
    <table className="table w-full table-sm">
      <thead>
        <tr className="text-xs text-base-content/40 border-b border-base-200">
          {tableHeader.map((h) => (
            <th key={h.id} className="px-6 py-3 text-left font-medium">
              {h.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} className="border-b border-base-200">
            {tableHeader.map((h) => (
              <td key={h.id} className="px-6 py-4">
                <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 30}%` }} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CustomerListings({ customerData, onStatusChange, loading }) {
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
  });
  const [page, setPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [modalRemark, setModalRemark] = useState(null);
  const remarksDialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeDropdown === null) return;
    const handler = (e) => {
      if (!e.target.closest('[data-dropdown-container]')) {
        setActiveDropdown(null);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
    };
  }, [activeDropdown]);

  useEffect(() => {
    if (!filterDropdownOpen) return;
    const handler = (e) => {
      if (!e.target.closest('[data-filter-dropdown]')) {
        setFilterDropdownOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener('click', handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handler);
    };
  }, [filterDropdownOpen]);

  const { rows, total, totalPages, currentPage } = useMemo(() => {
    if (!customerData)
      return { rows: [], total: 0, totalPages: 0, currentPage: 1 };
    const sorted = [...customerData].sort((a, b) => {
      const aDate = a.last_contact ? new Date(a.last_contact).getTime() : 0;
      const bDate = b.last_contact ? new Date(b.last_contact).getTime() : 0;
      return bDate - aDate;
    });
    const filtered = sorted.filter((customer) => {
      const matchesStatus =
        filters.status === 'all' || customer.status === filters.status;
      const matchesSearch =
        customer.cust_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        String(customer.phone).includes(filters.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    const filteredPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, filteredPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return {
      rows: filtered.slice(start, start + PAGE_SIZE),
      total: filtered.length,
      totalPages: filteredPages,
      currentPage: safePage,
    };
  }, [filters, customerData, page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      searchTerm: '',
    });
    setPage(1);
  };

  const statusFilter = ['all', ...statusList.map((s) => s.name)];

  const sendCustomerDetails = (destination, customer) => {
    try {
      navigate(destination, { state: { customer } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDropdownClick = (cust_id) => {
    setActiveDropdown((prev) => (prev === cust_id ? null : cust_id));
  };

  const handleStatusSelect = (cust_id, newStatus) => {
    setActiveDropdown(null);
    onStatusChange(cust_id, newStatus);
    document.activeElement?.blur();
  };

  const handleFilterSelect = (value) => {
    setFilterDropdownOpen(false);
    updateFilter('status', value);
    document.activeElement?.blur();
  };

  return (
    <div className="dashboard-card overflow-visible">
      <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
        <div className="shrink-0">
          <p className="font-semibold text-sm text-base-content">
            Customer Directory
          </p>
          <p className="text-xs text-base-content/40">
            Manage and track all your potential customers
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <label className="input input-bordered input-sm flex items-center gap-2 w-70">
            <Search size={15} className="text-base-content/40 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="grow"
            />
          </label>
          <div
            className={`dropdown dropdown-end ${filterDropdownOpen ? 'dropdown-open' : ''}`}
            data-filter-dropdown
          >
            <div
              tabIndex={0}
              role="button"
              className="cursor-pointer"
              onClick={() => setFilterDropdownOpen((prev) => !prev)}
            >
              <span
                className={`badge ${filters.status === 'all' ? 'badge-ghost' : getBadgeClass(filters.status)}`}
              >
                {filters.status === 'all' ? 'All Status' : filters.status}
              </span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-56 p-2 shadow-sm"
            >
              <li>
                <button
                  className={
                    filters.status === 'all'
                      ? 'text-base-content font-semibold'
                      : ''
                  }
                  onClick={() => handleFilterSelect('all')}
                >
                  <span className="badge badge-ghost w-full justify-start">
                    All Status
                  </span>
                </button>
              </li>
              {statusFilter
                .filter((s) => s !== 'all')
                .map((status) => (
                  <li key={status}>
                    <button
                      className={
                        filters.status === status
                          ? 'text-base-content font-semibold'
                          : ''
                      }
                      onClick={() => handleFilterSelect(status)}
                    >
                      <span
                        className={`badge ${getBadgeClass(status)} w-full justify-start`}
                      >
                        {status}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : !customerData || customerData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-base-100">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
            <FaPeopleGroup size={28} />
          </div>
          <h3 className="text-base font-semibold text-base-content">
            No active customer records
          </h3>
          <p className="text-xs text-base-content/40 mt-1 max-w-sm">
            Your customer directory is empty. Go to Profile to import data from
            Google Sheets.
          </p>
        </div>
      ) : total === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-base-100">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
            <FaPeopleGroup size={28} />
          </div>
          <h3 className="text-base font-semibold text-base-content">
            No matching customers
          </h3>
          <p className="text-xs text-base-content/40 mt-1 max-w-sm">
            No customers match your current filters. Try adjusting your search
            or clearing the filters.
          </p>
        </div>
      ) : (
        <table className="table w-full table-sm">
          <thead>
            <tr className="text-xs text-base-content/40 border-b border-base-200">
              {tableHeader.map((eachHeader) => (
                <th
                  key={eachHeader.id}
                  className="px-6 py-3 text-left font-medium"
                >
                  {eachHeader.name}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody variants={tableVariants} initial="hidden" animate="visible">
            {rows.map((customer) => (
              <motion.tr
                key={customer.cust_id}
                variants={rowVariants}
                className="border-b border-base-200 hover:bg-base-200 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-base-content">
                      {customer.cust_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    className="btn btn-link btn-sm text-success-icon normal-case no-underline"
                    onClick={() => sendCustomerDetails('/whatsapp', customer)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SiWhatsapp size={14} className="text-success-icon" />
                    <div className="text-sm text-success">{customer.phone}</div>
                  </motion.button>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-base-content/70">
                    {customer.location ?? '-'}
                  </div>
                  <div className="text-xs text-base-content/40">
                    {customer.budget ?? '-'}
                  </div>
                </td>
                <td>
                  <div
                    className={`dropdown dropdown-end ${activeDropdown === customer.cust_id ? 'dropdown-open' : ''}`}
                    data-dropdown-container
                  >
                    <div
                      tabIndex={0}
                      role="button"
                      className="cursor-pointer"
                      onClick={() => handleDropdownClick(customer.cust_id)}
                    >
                      <span
                        className={`badge ${getBadgeClass(customer.status)}`}
                      >
                        {customer.status}
                      </span>
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-56 p-2 shadow-sm"
                    >
                      {statusList.map((s) => (
                        <li key={s.id}>
                          <button
                            className={
                              s.name === customer.status
                                ? 'text-base-content font-semibold'
                                : ''
                            }
                            onClick={() =>
                              handleStatusSelect(customer.cust_id, s.name)
                            }
                          >
                            <span
                              className={`badge ${getBadgeClass(s.name)} w-full justify-start`}
                            >
                              {s.name}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
                <td className="text-sm px-6 py-4 text-base-content/60">
                  {formatDate(customer.last_contact)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      name="micButton"
                      className="btn btn-sm btn-ghost border border-success-icon/30 hover:bg-success-icon/10"
                      onClick={() => sendCustomerDetails('/speech', customer)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mic size={15} />
                    </motion.button>
                  </div>
                </td>
                <td className="px-6 py-4 text-base-content/60 max-w-xs">
                  {customer.remarks?.speechAnalysis ? (
                    <>
                      <p className="line-clamp-2 mb-1 text-sm">
                        {customer.remarks.speechAnalysis.summary ||
                          'No summary'}
                      </p>
                      <button
                        className="btn btn-link btn-xs text-info-icon normal-case no-underline"
                        onClick={() => {
                          setModalCustomer(customer.cust_name);
                          setModalRemark(customer.remarks.speechAnalysis);
                          remarksDialogRef.current?.showModal();
                        }}
                      >
                        Details
                      </button>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      )}

      {customerData && customerData.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 text-xs text-base-content/40">
          <span>
            Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}-
            {Math.min(currentPage * PAGE_SIZE, total)} of {total} customers
          </span>
          <div className="flex items-center gap-2">
            <button
              className="p-1 rounded hover:bg-base-200 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            <span className="font-medium text-base-content/70">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="p-1 rounded hover:bg-base-200 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <dialog
        ref={remarksDialogRef}
        className="modal"
        onClose={() => {
          setModalCustomer(null);
          setModalRemark(null);
        }}
      >
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Remarks — {modalCustomer}</h3>
          {modalRemark && (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-base-content/80">
                  Call Datetime:
                </span>{' '}
                {modalRemark.callDatetime
                  ? new Date(modalRemark.callDatetime).toLocaleString()
                  : '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Buyer Stage:
                </span>{' '}
                {modalRemark.buyerStage || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Purpose:
                </span>{' '}
                {modalRemark.purpose || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Sentiment:
                </span>{' '}
                {modalRemark.sentiment || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Next Action:
                </span>{' '}
                {modalRemark.nextActions?.[0] || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Preferences:
                </span>{' '}
                {modalRemark.preferences || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Next Follow Up:
                </span>{' '}
                {modalRemark.nextActions?.[1] || '-'}
              </div>
              <div>
                <span className="font-semibold text-base-content/80">
                  Summary:
                </span>{' '}
                {modalRemark.summary || '-'}
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default CustomerListings;
