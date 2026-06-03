import AIResponseReview from "../components/LeadWhatsapp/AIResponseReview.jsx";
import ContactInfo from "../components/LeadWhatsapp/ContactInfo.jsx";
import ConvoHistory from "../components/LeadWhatsapp/ConvoHistory.jsx";
import LeadHeader from "../components/LeadWhatsapp/LeadHeader.jsx";
import StatusCards from "../components/Home/StatusCards.jsx";
import { useState, useEffect } from "react";
import users from "../data/dummyData.js";
import dummyWAHistory from "../data/dummyWAHistory.js";
import dummyAIResponse from "../data/dummyAIResponse.js";
import { useLocation } from "react-router-dom";
import { STATUS_NAME } from "../data/constants";

function LeadDetail() {
  const [showUser, setShowUser] = useState({
    id: 0,
    name: "Blank",
    breadcrumb: { parent: "Lead Pipeline", current: "Blank" },
    contact: {
      email: "",
      phone: "",
      preferences: "",
    },
    status: "",
    syncStatus: [
      {
        id: 1,
        name: "Google Sheets Not Connected",
        lastSync: "",
        connected: false,
      },
      { id: 2, name: "WhatsApp Not Linked", lastSync: "", connected: false },
    ],
  });
  const { state } = useLocation();

  const [platformStatus, setPlatformStatus] = useState({
    whatsapp: {
      connectionStatus: STATUS_NAME.NOT_CONNECTED,
      lastSync: null,
    },
  });

  useEffect(() => {
    const customer = state?.customer;
    const user = customer ? users.find((u) => u.id === customer.id) : users[0];
    console.log("customer", customer);
    console.log("user", user)

    setShowUser(user ?? users[0]);
  }, [state]);

  const handleUpdateStatus = () => {
    setPlatformStatus((prev) => ({
      ...prev,
      whatsapp: {
        connectionStatus: STATUS_NAME.CONNECTED,
        lastSync: Date.now(),
      },
    }));
  };

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <LeadHeader user={showUser} users={users} />
        <div className="flex flex-row">
          <div className="basis-1/3">
            <ContactInfo user={showUser} users={users} />
            <StatusCards
              platformName="whatsapp"
              status={platformStatus.whatsapp}
              onUpdate={handleUpdateStatus}
            />
          </div>
          <div className="basis-2/3">
            <ConvoHistory waHistory={dummyWAHistory} user={showUser} />
          </div>
        </div>
        <AIResponseReview aiResponse={dummyAIResponse} user={showUser} />
      </div>
    </div>
  );
}

export default LeadDetail;
