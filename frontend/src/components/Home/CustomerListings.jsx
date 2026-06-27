import { useState, useEffect, useMemo } from 'react';
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
import { motion } from 'motion/react';

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

function CustomerListings({ customerData, onDataChange, commitVersion }) {
  const [customers, setCustomers] = useState([]);
  const [originalStatus, setOriginalStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  //Status value map with customer.status
  //Object.fromEntries transforms a list of key-value pairs into an object
  const [status, setStatus] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
  });
  const navigate = useNavigate();

  const handleStatusChange = (cust_id, value) => {
    // setStatus((prev) => ({ ...prev, [id]: value }));
    const updatedStatus = { ...status, [cust_id]: value };
    setStatus(updatedStatus);

    const changed = customers
      .filter((c) => updatedStatus[c.cust_id] !== originalStatus[c.cust_id])
      .map((c) => ({
        ...c,
        originalStatus: originalStatus[c.cust_id],
        newStatus: updatedStatus[c.cust_id],
      }));

    console.log('Changed Value', changed);

    onDataChange?.(changed);
  };

  // Whenever there are changes in customerData, assuming from button sync data, the use effect below will run
  useEffect(() => {
    const syncData = async () => {
      //Prevent first time loading no customer data
      if (!customerData) return;
      setLoading(true);
      try {
        console.log('CustomerData in syncData: ' + customerData);
        // setCustomers(customerData);
        setCustomers(Array.isArray(customerData) ? customerData : []);
        const statusMap = Object.fromEntries(
          customerData.map((customer) => [customer.cust_id, customer.status]),
        );
        setStatus(statusMap);
        setOriginalStatus(statusMap);
      } catch (err) {
        setError('Failed to fetch data');
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    syncData();
  }, [customerData]);

  useEffect(() => {
    if (commitVersion > 0) {
      setOriginalStatus({ ...status });
    }
  }, [commitVersion]);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesStatus =
        filters.status === 'all' || customer.status === filters.status;
      const matchesSearch =
        customer.cust_name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        String(customer.phone).includes(filters.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    // TODO: Sort filtered results by date (later)

    return filtered;
  }, [filters, customers]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      searchTerm: '',
    });
  };

  const statusFilter = ['all', ...new Set(customers.map((p) => p.status))];

  const sendCustomerDetails = (destination, customer) => {
    try {
      navigate(destination, { state: { customer } });
    } catch (err) {
      //Display a toast message to display navigation error
      toast.error(err.message);
    }
  };

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
        {/* Left - Title */}
        <div className="shrink-0">
          <p className="font-semibold text-sm text-base-content">
            Customer Directory
          </p>
          <p className="text-xs text-base-content/40">
            Manage and track all your potential customers
          </p>
        </div>
        {/* Right - Filters */}
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

      {loading && (
        <table className="table w-full text-sm">
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
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-base-200">
                {/* Name */}
                <td className="px-6 py-4">
                  <div className="skeleton h-4 w-28"></div>
                </td>
                {/* Contact (Email & Phone) */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    <div className="skeleton h-4 w-40"></div>
                    <div className="skeleton h-3 w-24"></div>
                  </div>
                </td>
                {/* Budget */}
                <td className="px-6 py-4">
                  <div className="skeleton h-4 w-20"></div>
                </td>
                {/* Location */}
                <td className="px-6 py-4">
                  <div className="skeleton h-4 w-24"></div>
                </td>
                {/* Status Dropdown */}
                <td className="px-6 py-4">
                  <div className="skeleton h-8 w-28 rounded-lg"></div>
                </td>
                {/* Last Contact */}
                <td className="px-6 py-4">
                  <div className="skeleton h-4 w-24"></div>
                </td>
                {/* Actions (Buttons) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-8 w-8 rounded-md"></div>
                    <div className="skeleton h-8 w-8 rounded-md"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {error && (
        <div className="alert alert-error mx-6 my-4">
          <span>{error}</span>
        </div>
      )}

      {/* Styled High-Fidelity Empty State Box to occupy screen real estate elegantly */}
      {!loading && !error && filteredAndSortedCustomers.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-24 bg-base-100">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4 text-base-content/30">
            <FaPeopleGroup size={28} />
          </div>
          <h3 className="text-base font-semibold text-base-content">
            No active customer records
          </h3>
          <p className="text-xs text-base-content/40 mt-1 max-w-sm">
            Your customer directory is empty. Get started by clicking on the
            Import From Google Sheets above.
          </p>
        </div>
      )}

      {!loading && !error && filteredAndSortedCustomers.length > 0 && (
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
            {filteredAndSortedCustomers.map((customer) => (
              <motion.tr
                key={customer.cust_id}
                className="border-b border-base-200 hover:bg-base-200 transition-colors"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: customer.cust_id * 0.05, duration: 0.2 }}
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
                    className={`select select-bordered select-sm w-full ${
                      status[customer.cust_id] !== originalStatus[customer.cust_id]
                        ? 'border-warning text-warning'
                        : ''
                    }`}
                    value={status[customer.cust_id] ?? customer.status}
                    onChange={(e) =>
                      handleStatusChange(customer.cust_id, e.target.value)
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
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-between px-6 py-3 text-xs text-base-content/40">
        <span>
          Showing {filteredAndSortedCustomers.length} of {customers.length}{' '}
          customers
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-base-200">
            <ChevronLeft size={15} />
          </button>
          <button className="p-1 rounded hover:bg-base-200">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerListings;
