import AIResponseReview from "./components/LeadWhatsapp/AIResponseReview.jsx";
import ContactInfo from "./components/LeadWhatsapp/ContactInfo.jsx";
import ConvoHistory from "./components/LeadWhatsapp/ConvoHistory.jsx";
import LeadHeader from "./components/LeadWhatsapp/LeadHeader.jsx";
import SyncStatus from "./components/LeadWhatsapp/SyncStatus.jsx";
import { useState, useEffect } from "react";
import users from "./data/dummyData.js";

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

  const showUserInfo = (user) => {
    setShowUser((prev) => user);
    console.log(`User info:${user}`);
  };

  useEffect(() => {
    showUserInfo(users.find((user) => user.id === 1));
  }, []);

  return (
    <>
      <div className="bg-[#45464D] h-screen">
        <LeadHeader user={showUser} />
        <div className="flex flex-row">
          <div className="basis-1/3">
            <ContactInfo user={showUser} />
            <SyncStatus />
          </div>
          <div className="basis-2/3">
            <ConvoHistory />
            <AIResponseReview />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeadDetail;
