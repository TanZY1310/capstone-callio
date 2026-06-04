import { useState } from "react";

import CustomerListings from "../components/Home/CustomerListings";
import SheetsDataIntegration from "../components/Home/SheetsDataIntegration";
import StatusCards from "../components/Home/StatusCards";
import Header from "../components/Layout/Header";
import { STATUS_NAME } from "../data/constants";

import { motion } from "motion/react";

function HomePage() {
  const [customerData, setCustomerData] = useState(null);
  //Status Card
  const [platformStatus, setPlatformStatus] = useState({
    sheets: {
      connectionStatus: STATUS_NAME.NOT_CONNECTED,
      lastSync: null,
    },
  });
  //Summary Changed Records
  const [changedRecords, setChangedRecords] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const handleImport = (data) => {
    setCustomerData(data);
    setChangedRecords([]); //Reset change records after import
  };

  const handleDataChange = (changed) => {
    setChangedRecords(changed);
  };

  const handleExport = () => {
    setChangedRecords([]); //Clear change records after export
    setPlatformStatus((prev) => ({
      ...prev,
      sheets: { ...prev.sheets, lastSync: Date.now() },
    }));
  };

  const handleUpdateStatus = () => {
    setPlatformStatus((prev) => ({
      ...prev,
      sheets: {
        connectionStatus: STATUS_NAME.CONNECTED,
        lastSync: Date.now(),
      },
    }));
    setIsConnected(true);
  };

  return (
    <>
      {/* Change background to darker colour */}
      <div className="flex h-screen bg-base-200">
        {/* Add spacing in header - move to the right slightly */}
        <motion.div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <div>
            <Header
              h1="Customer Listings"
              p="Import customer details, manage customers and update status"
            />
          </div>
          {/* Pass handler function as prop to button */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <SheetsDataIntegration
                onImport={handleImport}
                changedRecords={changedRecords}
                onExport={handleExport}
                isConnected={isConnected}
              />
            </div>
            <StatusCards
              platformName="sheets"
              status={platformStatus.sheets}
              onUpdate={handleUpdateStatus}
            />
          </div>
          {/* Pass actual state value as prop to table */}
          <CustomerListings
            customerData={customerData}
            onDataChange={handleDataChange}
          />
        </motion.div>
      </div>
    </>
  );
}

export default HomePage;
