import { Bell, Settings } from "lucide-react";
import SyncCard from "./SyncCard";
import BuyerDirectory from "./CustomerListings";
import IntegrationCards from "./IntegrationCards";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Property Sales</h1>
            <p className="text-sm text-black mt-0.5">
              Manage buyers, analyze conversations, and close deals
            </p>
          </div>

          <SyncCard />
          <BuyerDirectory />
          <IntegrationCards />
        </main>
      </div>
    </div>
  );
}