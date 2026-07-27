import { useEffect, useState, useRef, useCallback } from 'react';
import CustomerListings from '../components/Home/CustomerListings';
import HomePageLoader from '../components/Home/HomePageLoader';
import StatusCards from '../components/Home/StatusCards';
import Header from '../components/Layout/Header';
import { STATUS_NAME } from '../data/constants';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';

function HomePage() {
  const [customerData, setCustomerData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const exportTimer = useRef(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const [customerResponse, sheetsStatusResponse] = await Promise.all([
          api.get('/customers/all'),
          api.get('/sheets/status'),
        ]);

        if (sheetsStatusResponse.data.connected) {
          setSheetsConnected(true);
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

  const triggerSheetExport = useCallback(() => {
    if (exportTimer.current) clearTimeout(exportTimer.current);
    exportTimer.current = setTimeout(async () => {
      try {
        await api.post('/sheets/export');
      } catch {
        toast.error('Sheet sync failed. Retry from Profile.');
      }
    }, 1500);
  }, []);

  useEffect(() => {
    return () => {
      if (exportTimer.current) clearTimeout(exportTimer.current);
    };
  }, []);

  const handleStatusChange = async (cust_id, newStatus) => {
    const now = new Date().toISOString();
    setCustomerData((prev) =>
      (prev || []).map((c) =>
        c.cust_id === cust_id
          ? { ...c, status: newStatus, last_contact: now }
          : c,
      ),
    );
    try {
      await api.patch(`/customers/${cust_id}`, { status: newStatus });
      triggerSheetExport();
    } catch {
      toast.error('Failed to save status change');
    }
  };

  const platformStatus = {
    sheets: {
      connectionStatus: sheetsConnected
        ? STATUS_NAME.CONNECTED
        : STATUS_NAME.NOT_CONNECTED,
    },
  };

  if (initialLoading) return <HomePageLoader />;

  return (
    <>
      <div className="flex flex-col h-full bg-base-200/50">
        <motion.div
          className="flex-1 px-8 py-6 space-y-6 flex flex-col min-h-0"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Header
              h1="Customer Listings"
              p="Manage customers and update status"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <StatusCards
              platformName="sheets"
              status={platformStatus.sheets}
            />
          </div>

          <CustomerListings
            customerData={customerData}
            onStatusChange={handleStatusChange}
            loading={initialLoading}
          />
        </motion.div>
      </div>
    </>
  );
}

export default HomePage;
