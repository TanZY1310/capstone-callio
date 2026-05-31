import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageSquare,
  Mic,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const tableHeader = [
  { id: 1, name: "Name" },
  { id: 2, name: "Contact" },
  { id: 3, name: "Budget" },
  { id: 4, name: "Location" },
  { id: 5, name: "Status" },
  { id: 6, name: "Last Contact" },
  { id: 7, name: "Actions" },
  { id: 8, name: "Remarks" },
];

const statusList = [
  { id: 1, name: "No Pickup" },
  { id: 2, name: "Bonding / Might Keep In Touch" },
  { id: 3, name: "Not Interested" },
  { id: 4, name: "WhatsApp" },
  { id: 5, name: "Stop Following Up" },
  { id: 6, name: "Pending Appointment" },
  { id: 7, name: "Appointment" },
  { id: 8, name: "Booking" },
  { id: 9, name: "Completed" },
].sort((a, b) => a.name.localeCompare(b.name));

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function CustomerListings({ customerData }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //Status value map with customer.status
  //Object.fromEntries transforms a list of key-value pairs into an object
  const [status, setStatus] = useState({});
  const [filters, setFilters] = useState({
    status: "all",
    searchTerm: "",
  });
  const navigate = useNavigate();

  const handleStatusChange = (id, value) => {
    setStatus((prev) => ({ ...prev, [id]: value }));
  };

  // Whenever there are changes in customerData, assuming from button sync data, the use effect below will run
  useEffect(() => {
    const syncData = async () => {
      //Prevent first time loading no customer data
      if (!customerData) return;
      //Simulate Data syncing with Google Sheets, implement fetch later
      console.log("Function syncData has started");
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.log("CustomerData in syncData: " + customerData);
        setCustomers(customerData);
        setStatus(
          Object.fromEntries(customerData.map((b) => [b.id, b.status])),
        );
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    syncData();
  }, [customerData]);

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter((customer) => {
      const matchesStatus =
        filters.status === "all" || customer.status === filters.status;
      const matchesSearch =
        customer.name
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    // Sort filtered results by date (later)

    return filtered;
  }, [filters, customers]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      searchTerm: "",
    });
  };

  const statusFilter = ["all", ...new Set(customers.map((p) => p.status))];

  const sendCustomerDetails = (destination, customer) => {
    try {
      navigate(destination, { state: { customer } });
    } catch (err) {
      //Display a toast message to display navigation error
    }
  };

  return (
    <div>
      <div className="bg-base-100 rounded-2xl border border-base-200">
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
                onChange={(e) => updateFilter("searchTerm", e.target.value)}
                className="grow"
              />
            </label>
            <select
              className="select select-bordered select-sm"
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              {statusFilter.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
                </option>
              ))}
            </select>
            <button className="btn btn-sm btn-ghost" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex w-200 flex-col gap-4">
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mx-6 my-4">
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filteredAndSortedCustomers.length === 0 && (
          <div className="text-center py-12 text-base-content/40 text-sm">
            No customers found. Click on import data From Google Sheets.
          </div>
        )}

        {!loading && !error && filteredAndSortedCustomers.length > 0 && (
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
              {filteredAndSortedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-base-200 hover:bg-base-200 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-base-content">
                        {customer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base-content/60">
                    <div>{customer.email}</div>
                    <div>{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-base-content/70">
                    {customer.budgetMin} – {customer.budgetMax}
                  </td>
                  <td className="px-6 py-4 text-base-content/60">
                    {customer.location}
                  </td>
                  <td>
                    <select
                      name="status"
                      className="select select-bordered select-sm w-full"
                      value={status[customer.id]}
                      onChange={(e) =>
                        handleStatusChange(customer.id, e.target.value)
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
                    {formatDate(customer.lastContact)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        name="messageButton"
                        className="btn btn-sm btn-ghost text-success border border-success/30 hover:bg-success/10"
                        onClick={() =>
                          sendCustomerDetails("/whatsapp", customer)
                        }
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button
                        name="micButton"
                        className="btn btn-sm btn-ghost border border-success/30 hover:bg-success/10"
                        onClick={(e) =>
                          sendCustomerDetails("/speech", customer)
                        }
                      >
                        <Mic size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between px-6 py-3 text-xs text-base-content/40">
          <span>
            Showing {filteredAndSortedCustomers.length} of {customers.length}{" "}
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
    </div>
  );
}

export default CustomerListings;
