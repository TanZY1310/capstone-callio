import { Bell, Settings } from "lucide-react";
import SyncCard from "./SyncCard";
import BuyerDirectory from "./CustomerListings";
import IntegrationCards from "./IntegrationCards";
import Header from "../Layout/Header";

export default function Dashboard() {
  return (
    <>
      {/* Change background to darker colour */}
      <div className="flex h-screen bg-base-200">
        {/* Add spacing in header - move to the right slightly */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div>
            <Header
              h1="Customer Listings"
              p="Import customer details, manage customers And update status"
            />
          </div>

          <SyncCard />
          <BuyerDirectory />
          <IntegrationCards />
        </div>
      </div>
    </>
    
  );
}
