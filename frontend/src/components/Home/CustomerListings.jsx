import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MessageSquare,
  Mic,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { toast } from 'sonner';
import { statusList } from '../../data/statusList';
import { tableHeader } from '../../data/tableHeader';

const PAGE_SIZE = 10;

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

function CustomerListings({ customerData, onStatusChange }) {
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { rows, total, totalPages, currentPage } = useMemo(() => {
    if (!customerData) return { rows: [], total: 0, totalPages: 0, currentPage: 1 };
    const filtered = customerData.filter((customer) => {
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

  const statusFilter = ['all', ...new Set((customerData || []).map((p) => p.status))];

  const sendCustomerDetails = (destination, customer) => {
    try {
      navigate(destination, { state: { customer } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="dashboard-card overflow-hidden">
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
          <select
            className="select select-bordered select-sm"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            {statusFilter.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>
          <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {!customerData || customerData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-base-100">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
            <FaPeopleGroup size={28} />
          </div>
          <h3 className="text-base font-semibold text-base-content">
            No active customer records
          </h3>
          <p className="text-xs text-base-content/40 mt-1 max-w-sm">
            Your customer directory is empty. Go to Profile to import data from Google
            Sheets.
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
            No customers match your current filters. Try adjusting your search or
            clearing the filters.
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
          <tbody>
            {rows.map((customer) => (
              <tr
                key={customer.cust_id}
                className="border-b border-base-200 hover:bg-base-200 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-base-content">
                      {customer.cust_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-base-content/60">
                  <div>{customer.phone}</div>
                </td>
                <td className="px-6 py-4 text-base-content/70">
                  {customer.budget ?? '-'}
                </td>
                <td className="px-6 py-4 text-base-content/60">
                  {customer.location ?? '-'}
                </td>
                <td>
                  <select
                    name="status"
                    className="select select-bordered select-sm w-full"
                    value={customer.status}
                    onChange={(e) =>
                      onStatusChange?.(customer.cust_id, e.target.value)
                    }
                  >
                    {statusList.map((eachStatus) => (
                      <option key={eachStatus.id} value={eachStatus.name}>
                        {eachStatus.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-base-content/60">
                  {formatDate(customer.last_contact)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      name="messageButton"
                      className="btn btn-sm btn-ghost text-success border border-success/30 hover:bg-success/10"
                      onClick={() => sendCustomerDetails('/whatsapp', customer)}
                    >
                      <MessageSquare size={15} />
                    </button>
                    <button
                      name="micButton"
                      className="btn btn-sm btn-ghost border border-success/30 hover:bg-success/10"
                      onClick={() => sendCustomerDetails('/speech', customer)}
                    >
                      <Mic size={15} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-base-content/60 leading-relaxed min-w-[220px]">
                  {customer.remarks?.speechAnalysis ? (
                    <>
                      <div><span className="font-semibold text-base-content/80">Call Datetime:</span> {customer.remarks.speechAnalysis.callDatetime ? new Date(customer.remarks.speechAnalysis.callDatetime).toLocaleString() : '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Buyer Stage:</span> {customer.remarks.speechAnalysis.buyerStage || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Purpose:</span> {customer.remarks.speechAnalysis.purpose || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Sentiment:</span> {customer.remarks.speechAnalysis.sentiment || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Next Action:</span> {customer.remarks.speechAnalysis.nextActions?.[0] || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Preferrance:</span> {customer.remarks.speechAnalysis.preferences || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Next Follow Up:</span> {customer.remarks.speechAnalysis.nextActions?.[1] || '-'}</div>
                      <div><span className="font-semibold text-base-content/80">Summary:</span> {customer.remarks.speechAnalysis.summary || '-'}</div>
                    </>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
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
    </div>
  );
}

export default CustomerListings;
