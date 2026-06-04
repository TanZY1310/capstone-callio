import AIResponseReview from "../components/LeadWhatsapp/AIResponseReview.jsx";
import ContactInfo from "../components/LeadWhatsapp/ContactInfo.jsx";
import ConvoHistory from "../components/LeadWhatsapp/ConvoHistory.jsx";
import LeadHeader from "../components/LeadWhatsapp/LeadHeader.jsx";
import StatusCards from "../components/Home/StatusCards.jsx";
import { useState, useEffect, useRef } from "react";
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
    contact: { email: "", phone: "", preferences: "" },
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
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [platformStatus, setPlatformStatus] = useState({
    whatsapp: { connectionStatus: STATUS_NAME.NOT_CONNECTED, lastSync: null },
  });

  // Load user from navigation state
  useEffect(() => {
    const customer = state?.customer;
    const customerFound = customer
      ? users.find((u) => u.id === customer.id)
      : users[0];
    setShowUser(customerFound ?? users[0]);
  }, [state]);

  // Load chat history when user changes
  useEffect(() => {
    if (!showUser || showUser.id === 0) return;

    const fetchChatHistory = async () => {
      // placeholder for real WA Business API call later
      let waApiUrl = "https://jsonplaceholder.typicode.com/users";
      const response = await fetch(waApiUrl);
      const data = await response.json();
      const userHistory = dummyWAHistory.find((u) => u.userID === showUser.id);
      const userMessages = userHistory?.messages ?? [];
      setMessages(userMessages);
    };

    fetchChatHistory();
  }, [showUser]);

  useEffect(() => {
    // assuming API fetching is done outside of this component for now
    // due to the fact that we pass in dummy AI response
    const updateResponse = async () => {
      if (!dummyAIResponse || !showUser || showUser.id === 0) return; // guard clause

      console.log(`user id is ${showUser.id}`);
      const properUser = dummyAIResponse.find(
        (response) => response.userID === showUser.id,
      );
      const properResponse = properUser?.responses ?? [];
      console.log(`properResponse looks like ${properResponse}`);
      setResponses((prev) => [...prev, ...properResponse]);
    };

    updateResponse();
  }, [showUser]);


  const handleUpdateStatus = () => {
    setPlatformStatus((prev) => ({
      ...prev,
      whatsapp: {
        connectionStatus: STATUS_NAME.CONNECTED,
        lastSync: Date.now(),
      },
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "agent",
        content: text,
        timestamp: new Date().toISOString(),
        seen: null,
      },
    ]);

    inputRef.current.value = "";
  };
  
// Called by AIResponseReview Edit button
const handleEditAIResponse = (id, newText) => {
  setResponses(prev => prev.map(r => r.id === id ? { ...r, content: newText } : r));
};
  // Called by AIResponseReview Confirm button
  const handleConfirmAIResponse = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "agent",
        content,
        timestamp: new Date().toISOString(),
        seen: null,
      },
    ]);

    setResponses((prev)=>[...prev.filter(response=>response.content !== content)]);
    console.log(`${content} is removed from AI responses`)
    console.log(responses);
  };

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <LeadHeader user={showUser} users={users} />
        <div className="flex flex-row">
          <div className="basis-1/3">
            <ContactInfo user={showUser} users={users} />
            <div className="mt-6">
              <StatusCards
                platformName="whatsapp"
                status={platformStatus.whatsapp}
                onUpdate={handleUpdateStatus}
              />
            </div>
          </div>
          <div className="basis-2/3">
            <ConvoHistory
              messages={messages}
              inputRef={inputRef}
              onSend={handleSendMessage}
            />
          </div>
        </div>
        <AIResponseReview
          aiResponses = {responses}
          onEdit={handleEditAIResponse}
          onConfirm={handleConfirmAIResponse}
        />
      </div>
    </div>
  );
}

export default LeadDetail;
