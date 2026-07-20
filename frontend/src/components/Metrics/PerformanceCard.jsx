// import { useEffect, useMemo, useState } from 'react';
// import { CiSearch } from 'react-icons/ci';

// const status_label = {
//   needs_attention: { label: 'Needs Attention', className: 'badge badge-sm badge-success' },
//   follow_ups_needed: { label: 'Follow Up Needed', className: 'badge badge-sm badge-warning' },
//   on_track: { label: 'On Track', className: 'badge badge-sm badge-success' },
//   no_activity: { label: 'No Activity', className: 'badge badge-sm badge-info' },
// };

// function getRateClass(rate) {
//   if (rate === null || rate === undefined) return 'bg-base-200 text-base-content/40';
//   if (rate >= 50) return 'bg-green-100 text-green-800';
//   if (rate >= 25) return 'bg-yellow-100 text-yellow-800';
//   return 'bg-red-100 text-red-800';
// }

// const PAGE_SIZE_OPTIONS = [10, 25, 50];

// function PerformanceCard({ teamTable }) {
//   const [filters, setFilters] = useState({ searchTerm: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const filteredAgent = useMemo(() => {
//     if (!teamTable) return [];
//     return teamTable.filter((agent) =>
//       agent.agent_name.toLowerCase().includes(filters.searchTerm.toLowerCase())
//     );
//   }, [filters, teamTable]);

//   const totalItems = filteredAgent.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

//   // Reset to page 1 whenever the filtered set changes (search term, data reload).
//   // Without this, searching from page 3 down to 5 results leaves you on a blank page 3.
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters.searchTerm, teamTable]);

//   // Clamp defensively — e.g. if itemsPerPage changes and currentPage is now out of range.
//   useEffect(() => {
//     if (currentPage > totalPages) setCurrentPage(totalPages);
//   }, [totalPages, currentPage]);

//   const paginatedAgent = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredAgent.slice(start, start + itemsPerPage);
//   }, [filteredAgent, currentPage, itemsPerPage]);

//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   if (!teamTable) {
//     return (
//       <div className="card bg-base-100 border border-base-200 shadow-sm">
//         <div className="card-body gap-4">
//           <h2 className="card-title text-base-content">Agent Activity Summary</h2>
//           <span>Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
//   const endItem = Math.min(currentPage * itemsPerPage, totalItems);

//   return (
//     <div className="card bg-base-100 border border-base-200 shadow-sm">
//       <div className="card-body gap-4">
//         <div className="flex items-center justify-between">
//           <span className="font-semibold text-lg text-base-content">
//             Agent Activity Summary
//           </span>
//           <label className="input input-sm">
//             <CiSearch />
//             <input
//               type="search"
//               className="grow"
//               placeholder="Search here"
//               value={filters.searchTerm}
//               onChange={(e) => updateFilter('searchTerm', e.target.value)}
//             />
//           </label>
//         </div>

//         <table className="table w-full">
//           <thead>
//             <tr
//               className="text-xs uppercase"
//               style={{ background: 'linear-gradient(to right, #27324f, #27324f)' }}
//             >
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">No.</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">Agent Name</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">Calls This Month</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">Appointment Rate</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">Booking Rate</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">Pending Follow-Ups</th>
//               <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedAgent.map((agent, index) => (
//               <tr key={agent.agent_id} className="hover">
//                 {/* Row numbering must account for the page offset, not just local index */}
//                 <td className="text-base-content/70">
//                   {(currentPage - 1) * itemsPerPage + index + 1}
//                 </td>
//                 <td>
//                   <div className="flex items-center gap-3">
//                     <span className="font-semibold text-base-content">{agent.agent_name}</span>
//                   </div>
//                 </td>
//                 <td className="text-base-content text-center">{agent.calls}</td>
//                 <td className="text-center">
//                   <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.appointment_rate)}`}>
//                     {agent.appointment_rate != null ? `${agent.appointment_rate}%` : '—'}
//                   </span>
//                 </td>
//                 <td className="text-center">
//                   <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.booking_rate)}`}>
//                     {agent.booking_rate != null ? `${agent.booking_rate}%` : '—'}
//                   </span>
//                 </td>
//                 <td className="text-base-content text-center">{agent.followUps}</td>
//                 <td className="text-base-content text-center">
//                   {(() => {
//                     const config = status_label[agent.status] ?? status_label['no_activity'];
//                     return <span className={config.className}>{config.label}</span>;
//                   })()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination footer */}
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <div className="flex items-center gap-2 text-sm text-base-content/70">
//             <span>Items per page</span>
//             <select
//               className="select select-sm w-20"
//               value={itemsPerPage}
//               onChange={(e) => setItemsPerPage(Number(e.target.value))}
//             >
//               {PAGE_SIZE_OPTIONS.map((size) => (
//                 <option key={size} value={size}>{size}</option>
//               ))}
//             </select>
//           </div>

//           <span className="text-sm text-base-content/70">
//             Showing <strong>{startItem}–{endItem}</strong> out of <strong>{totalItems}</strong>
//           </span>

//           <div className="join">
//             <button
//               className="join-item btn btn-sm"
//               disabled={currentPage <= 1}
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             >
//               ← Prev
//             </button>
//             <button className="join-item btn btn-sm btn-disabled">{currentPage}</button>
//             <button
//               className="join-item btn btn-sm"
//               disabled={currentPage >= totalPages}
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             >
//               Next →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PerformanceCard;

import { useEffect, useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const status_label = {
  needs_attention: {
    label: 'Needs Attention',
    className: 'badge badge-sm badge-success',
  },
  follow_ups_needed: {
    label: 'Follow Up Needed',
    className: 'badge badge-sm badge-warning',
  },
  on_track: { label: 'On Track', className: 'badge badge-sm badge-success' },
  no_activity: { label: 'No Activity', className: 'badge badge-sm badge-info' },
};

function getRateClass(rate) {
  if (rate === null || rate === undefined)
    return 'bg-base-200 text-base-content/40';
  if (rate >= 50) return 'bg-green-100 text-green-800';
  if (rate >= 25) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function PerformanceCard({ teamTable }) {
  const [filters, setFilters] = useState({ searchTerm: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredAgent = useMemo(() => {
    if (!teamTable) return [];
    return teamTable.filter((agent) =>
      agent.agent_name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
    );
  }, [filters, teamTable]);

  const totalItems = filteredAgent.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 whenever the filtered set changes (search term, data reload).
  // Without this, searching from page 3 down to 5 results leaves you on a blank page 3.
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm, teamTable]);

  // Clamp defensively — e.g. if itemsPerPage changes and currentPage is now out of range.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedAgent = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAgent.slice(start, start + itemsPerPage);
  }, [filteredAgent, currentPage, itemsPerPage]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!teamTable) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title text-base-content">
            Agent Activity Summary
          </h2>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-base-content">
            Agent Activity Summary
          </span>
          <label className="input input-sm">
            <CiSearch />
            <input
              type="search"
              className="grow"
              placeholder="Search here"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </label>
        </div>

        <table className="table w-full">
          <thead>
            <tr
              className="text-xs uppercase"
              style={{
                background: 'linear-gradient(to right, #27324f, #27324f)',
              }}
            >
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">
                No.
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">
                Agent Name
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Active Leads
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Calls This Month
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Appointment Rate
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Booking Rate
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Pending Follow-Ups
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedAgent.map((agent, index) => (
              <tr key={agent.agent_id} className="hover">
                {/* Row numbering must account for the page offset, not just local index */}
                <td className="text-base-content/70">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-base-content">
                      {agent.agent_name}
                    </span>
                  </div>
                </td>
                <td className="text-base-content text-center">{agent.leads}</td>
                <td className="text-base-content text-center">{agent.calls}</td>
                <td className="text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.appointment_rate)}`}
                  >
                    {agent.appointment_rate != null
                      ? `${agent.appointment_rate}%`
                      : '—'}
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.booking_rate)}`}
                  >
                    {agent.booking_rate != null
                      ? `${agent.booking_rate}%`
                      : '—'}
                  </span>
                </td>
                <td className="text-base-content text-center">
                  {agent.followUps}
                </td>
                <td className="text-base-content text-center">
                  {(() => {
                    const config =
                      status_label[agent.status] ?? status_label['no_activity'];
                    return (
                      <span className={config.className}>{config.label}</span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <span>Items per page</span>
            <select
              className="select select-sm w-20"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <span className="text-sm text-base-content/70">
            Showing{' '}
            <strong>
              {startItem}–{endItem}
            </strong>{' '}
            out of <strong>{totalItems}</strong>
          </span>

          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button className="join-item btn btn-sm btn-disabled">
              {currentPage}
            </button>
            <button
              className="join-item btn btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceCard;
