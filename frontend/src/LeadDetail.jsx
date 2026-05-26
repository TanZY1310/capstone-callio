import AIResponseReview from "./components/AIResponseReview.jsx";
import ContactInfo from "./components/ContactInfo.jsx";
import ConvoHistory from "./components/ConvoHistory.jsx";
import LeadHeader from "./components/LeadHeader.jsx";
import SyncStatus from "./components/SyncStatus.jsx";
import { useState, useEffect } from "react";
import users from "./data/dummyData.js"

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
      <LeadHeader user={showUser}/>
      <ContactInfo user={showUser}/>
      <SyncStatus />
      <ConvoHistory />
      <AIResponseReview />
    </>
  );
}

export default LeadDetail;
