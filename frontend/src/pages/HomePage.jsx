import { useEffect, useState } from 'react';
import CustomerListings from '../components/Home/CustomerListings';
import SheetsDataIntegration from '../components/Home/SheetsDataIntegration';
import StatusCards from '../components/Home/StatusCards';
import Header from '../components/Layout/Header';
import { STATUS_NAME } from '../data/constants';
import { motion } from 'motion/react';
import { Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

function HomePage() {
  const [customerData, setCustomerData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
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

  const API_URL = import.meta.env.VITE_API_URL;

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

  const getAuthHeader = async () => {
    const token = await getAuth().currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        // Both calls are independent
        const [customerResponse, sheetsStatusResponse] = await Promise.all([
          axios.get(`${API_URL}/customers`, { headers: await getAuthHeader() }),
          axios.get(`${API_URL}/sheets/status`),
        ]);

        // Set status based on connection
        if (sheetsStatusResponse.data.connected) {
          console.log('Google Sheets Connected!');
          handleUpdateStatus();
        }

        if (customerResponse.data.length > 0) {
          setCustomerData(customerResponse.data);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setInitialLoading(false);
      }
    };
    initialize();
  }, []);

  const handleImport = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/sheets/sync`,
        {},
        { headers: await getAuthHeader() },
      );
      setCustomerData(response.data);
      //Reset change records after import
      setChangedRecords([]);
      //Update status after import
      handleUpdateStatus();
    } catch (err) {
      toast.error('Failed to load customers after sync.', err.message);
    }
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

  return (
    <>
      {/* Change background to darker colour */}
      <div className="flex min-h-screen bg-base-200/50">
        {/* Add spacing in header - move to the right slightly */}
        <motion.div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Header
              h1="Customer Listings"
              p="Import customer details, manage customers and update status"
            />
          </div>

          {/* Dynamic KPI Analytics Row to capture whitespace */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="dashboard-card p-5 flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-base-content font-medium">
                  Total Tracked Directory
                </p>
                <h3 className="text-2xl font-bold">
                  {customerData?.length || 0}{' '}
                  <span className="text-xs font-normal text-base-content/40">
                    Leads
                  </span>
                </h3>
              </div>
            </div>
            <div className="dashboard-card p-5 flex items-center gap-4">
              <div className="p-3 bg-warning/10 text-warning rounded-xl">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-base-content font-medium">
                  Pending Sync Changes
                </p>
                <h3 className="text-2xl font-bold text-warning">
                  {changedRecords.length}{' '}
                  <span className="text-xs font-normal text-base-content/40">
                    Records
                  </span>
                </h3>
              </div>
            </div>
            <StatusCards
              platformName="sheets"
              status={platformStatus.sheets}
              onUpdate={handleUpdateStatus}
            />
          </div>

          {/* Pass handler function as prop to button */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <div className="lg:col-span-2">
              <SheetsDataIntegration
                onImport={handleImport}
                changedRecords={changedRecords}
                onExport={handleExport}
                isConnected={isConnected}
                hasExistingData={customerData?.length > 0}
              />
            </div>
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
