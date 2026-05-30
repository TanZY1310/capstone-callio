import { useState } from "react";
import { Search, MessageSquare, Mic, ChevronLeft, ChevronRight } from "lucide-react";
import sampleBuyers from "../../data/SampleBuyers"

const statusStyle = {
  HOT: "text-error font-semibold",
  WARM: "text-warning font-semibold",
  COLD: "text-info font-semibold",
};

const avatarStyle = {
  SC: "bg-purple-100 text-purple-700",
  MR: "bg-blue-100 text-blue-700",
  ET: "bg-green-100 text-green-700",
  JW: "bg-orange-100 text-orange-700",
};

export default function BuyerDirectory() {
  const [search, setSearch] = useState("");

  const filtered = sampleBuyers.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <button className="bg-black text-neutral-content text-sm font-medium px-5 py-2 rounded-full mb-4">
        All Customers
      </button>

      <div className="bg-base-100 rounded-2xl border border-base-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-sm">Customer Directory</p>
            <p className="text-xs text-base-content/40">Manage and track all your potential customers</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search buyers by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-base-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-base-content/40 border-b border-gray-100">
              {["Name", "Contact", "Budget", "Location", "Status", "Last Contact", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((buyer) => (
              <tr key={buyer.id} className="border-b border-gray-50 hover:bg-base-200 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${avatarStyle[buyer.initials]}`}>
                      {buyer.initials}
                    </div>
                    <span className="font-medium text-base-content">{buyer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  <div>{buyer.email}</div>
                  <div>{buyer.phone}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{buyer.budgetMin} – {buyer.budgetMax}</td>
                <td className="px-6 py-4 text-gray-500">{buyer.location}</td>
                <td className="px-6 py-4">
                  <span className={statusStyle[buyer.status]}>{buyer.status}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{buyer.lastContact}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-green-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                      <MessageSquare size={15} />
                    </button>
                    <button className="p-2 border border-green-200 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                      <Mic size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3 text-xs text-base-content/40">
          <span>Showing {filtered.length} of {sampleBuyers.length} active buyers</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-gray-100"><ChevronLeft size={15} /></button>
            <button className="p-1 rounded hover:bg-gray-100"><ChevronRight size={15} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}