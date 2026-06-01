import AIResponseReview from "../components/LeadWhatsapp/AIResponseReview.jsx";
import ContactInfo from "../components/LeadWhatsapp/ContactInfo.jsx";
import ConvoHistory from "../components/LeadWhatsapp/ConvoHistory.jsx";
import LeadHeader from "../components/LeadWhatsapp/LeadHeader.jsx";
import SyncStatus from "../components/LeadWhatsapp/SyncStatus.jsx";
import { useState, useEffect } from "react";
import users from "../data/dummyData.js";
import dummyWAHistory from "../data/dummyWAHistory.js";

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

  useEffect(() => {
    const user = users.find((u) => u.id === 1);
    if (user) {
      setShowUser(user);
    } else {
      setShowUser(users[0]);
    }
  }, []);

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <LeadHeader user={showUser} />
        <div className="flex flex-row">
          <div className="basis-1/3">
            <ContactInfo user={showUser} />
            <SyncStatus />
          </div>
          <div className="basis-2/3">
            <ConvoHistory waHistory={dummyWAHistory} user={showUser} />
            <AIResponseReview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetail;
