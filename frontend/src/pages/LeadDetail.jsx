import AIResponseReview from '../components/LeadWhatsapp/AIResponseReview.jsx';
import ContactInfo from '../components/LeadWhatsapp/ContactInfo.jsx';
import ConvoHistory from '../components/LeadWhatsapp/ConvoHistory.jsx';
import LeadHeader from '../components/LeadWhatsapp/LeadHeader.jsx';
import StatusCards from '../components/Home/StatusCards.jsx';
import { useState, useEffect, useRef } from 'react';
import users from '../data/dummyData.js';
import dummyWAHistory from '../data/dummyWAHistory.js';
import dummyAIResponse from '../data/dummyAIResponse.js';
import { useLocation } from 'react-router-dom';
import { STATUS_NAME } from '../data/constants';
import axios from 'axios';

function LeadDetail() {
  const [showUser, setShowUser] = useState({
    id: 0,
    name: 'Blank',
    breadcrumb: { parent: 'Lead Pipeline', current: 'Blank' },
    contact: { email: '', phone: '', preferences: '' },
    status: '',
    syncStatus: [
      {
        id: 1,
        name: 'Google Sheets Not Connected',
        lastSync: '',
        connected: false,
      },
      { id: 2, name: 'WhatsApp Not Linked', lastSync: '', connected: false },
    ],
  });

  const FASTAPI_BASE_URL = "http://127.0.0.1:8000/whatsapp";
  const { state } = useLocation();
  const inputRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [responses, setResponses] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
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
    console.log(customerFound);
  }, [state]);

  // Load chat history when user changes
  useEffect(() => {
    if (!showUser || showUser.id === 0) return;

    const fetchChatHistory = async () => {
      // placeholder for real WA Business API call later
      let waApiUrl = 'https://jsonplaceholder.typicode.com/users';
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
      setResponses(properResponse);
    };

    updateResponse();
  }, [showUser]);

  const handleUpdateStatus = async () => {
    //start whatsapp client, change to axios method later
    await axios.post(`${FASTAPI_BASE_URL}/connect`);
    setShowQrModal(true);

    // 2. Poll /status until connected
    const poll = setInterval(async () => {
      const res = await axios.get(`${FASTAPI_BASE_URL}/status`);
      const data = await res.data;

      if (data.status === 'connected') {
        clearInterval(poll);
        setQrCode(null);
        setShowQrModal(false);
        setIsConnected(true);
        setPlatformStatus((prev) => ({
          ...prev,
          whatsapp: {
            connectionStatus: STATUS_NAME.CONNECTED,
            lastSync: Date.now(),
          },
        }));
      } else if (data.qr) {
        setQrCode(data.qr); // ← this is the base64 data URL
      }
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;

    await axios.post(`${FASTAPI_BASE_URL}/send/00000000-0000-0000-0000-000000000067`, {message:text});

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: 'agent',
        content: text,
        timestamp: new Date().toISOString(),
        seen: null,
      },
    ]);

    inputRef.current.value = '';
  };

  // Called by AIResponseReview Edit button
  const handleEditAIResponse = (id, newText) => {
    setResponses((prev) =>
      prev.map((r) => (r.id === id ? { ...r, content: newText } : r)),
    );
  };
  // Called by AIResponseReview Confirm button
  const handleConfirmAIResponse = async (content) => {

    await axios.post(`${FASTAPI_BASE_URL}/send/00000000-0000-0000-0000-000000000067`, {message:content});
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: 'agent',
        content,
        timestamp: new Date().toISOString(),
        seen: null,
      },
    ]);

    setResponses((prev) => [
      ...prev.filter((response) => response.content !== content),
    ]);
    console.log(`${content} is removed from AI responses`);
    console.log(responses);
  };

  const handleHeaderChange = (e) => {
    setShowUser(users.find((u) => u.id === parseInt(e.target.value)));
    console.log(showUser);
  };

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <LeadHeader
          user={showUser}
          users={users}
          onHeaderChange={handleHeaderChange}
        />
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
          {isConnected ? (
            <div className="basis-2/3">
              <ConvoHistory
                messages={messages}
                inputRef={inputRef}
                onSend={handleSendMessage}
              />
            </div>
          ) : (
            <div className="basis-2/3 flex items-center justify-center">
              <div className="card bg-base-100 shadow-sm w-96">
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Not Connected to WhatsApp</h2>
                  <p>Please connect to view conversation history.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {isConnected && (
          <AIResponseReview
            aiResponses={responses}
            onEdit={handleEditAIResponse}
            onConfirm={handleConfirmAIResponse}
          />
        )}
      </div>

      {/* QR modal — overlays everything, doesn't replace anything */} 
      {showQrModal && (
        <dialog className="modal modal-open">
          <div className="modal-box items-center text-center">
            <h3 className="font-bold text-lg">Scan QR Code</h3>
            <p className="py-2">Open WhatsApp → Linked Devices → Link a Device</p>
            {qrCode ? (
              <img src={qrCode} alt="WhatsApp QR" className="mx-auto w-64 h-64" />
            ) : (
              <span className="loading loading-spinner loading-lg" />
            )}
          </div>
        </dialog>
      )}
    </div>
  );
}

export default LeadDetail;
