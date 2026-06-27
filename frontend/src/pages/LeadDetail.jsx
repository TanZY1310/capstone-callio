import AIResponseReview from '../components/LeadWhatsapp/AIResponseReview.jsx';
import ContactInfo from '../components/LeadWhatsapp/ContactInfo.jsx';
import ConvoHistory from '../components/LeadWhatsapp/ConvoHistory.jsx';
import LeadHeader from '../components/LeadWhatsapp/LeadHeader.jsx';
import StatusCards from '../components/Home/StatusCards.jsx';
import { statusList } from '../data/statusList.js';
import { useState, useEffect, useRef } from 'react';
import { getAuthHeader } from '../utils/getAuthHeader';
//import users from '../data/dummyData.js';
// import dummyWAHistory from '../data/dummyWAHistory.js';
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
  const API_URL = import.meta.env.VITE_API_URL;
  const { state } = useLocation();
  const inputRef = useRef(null);
  const [location, setLocation] = useState({});
  const [users, setUsers] = useState([]);
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
    const loading = async () => {
      const customer = state?.customer;
      const usersResponse = await axios.get(`${FASTAPI_BASE_URL}/details/all`);
      const users = await usersResponse.data;
      const customerFound = customer
        ? users.find((u) => u.cust_id === customer.cust_id)
        : users[0];
      setUsers(users);
      setShowUser(customerFound ?? users[0]);
      console.log(customerFound);}

    loading();

  }, [state]);

  // Load chat history when user changes
  useEffect(() => {
    if (!showUser || showUser.id === 0) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`${FASTAPI_BASE_URL}/history/${showUser.cust_id}`);
        const data = await response.data;
        console.log(JSON.stringify(data,null,2));
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch WhatsApp history:', error);
        setMessages([]);
      }
    };

    fetchChatHistory();
  }, [showUser, platformStatus]);

  useEffect(() => {
    // assuming API fetching is done outside of this component for now
    // due to the fact that we pass in dummy AI response
    const updateResponse = async () => {
      if (!dummyAIResponse || !showUser || showUser.id === 0) return; // guard clause

      console.log(`user id is ${showUser.user_id}`);
      const properUser = dummyAIResponse.find(
        (response) => response.userID === showUser.user_id,
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

    await axios.post(`${FASTAPI_BASE_URL}/send/${showUser.cust_id}`, {message:text});

    setMessages((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        body: text, // "body" not "content" — matches API response shape
        timestamp: Math.floor(Date.now() / 1000), // Unix epoch seconds, not ISO string
        fromMe: true, // "fromMe" not "role" — matches API response shape
        type: 'chat',
        hasMedia: false,
      },
    ]);

    inputRef.current.value = '';
  };

  const handleEnterMessage = async (e) => {
    if (e.key !== 'Enter') return; // only act on Enter, don't block other keys
    if (e.shiftKey) return; //avoid sending on Shift + Enter
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (!text) return;
      await axios.post(`${FASTAPI_BASE_URL}/send/${showUser.cust_id}`, {message:text});

      setMessages((prev) => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          body: text, // "body" not "content" — matches API response shape
          timestamp: Math.floor(Date.now() / 1000), // Unix epoch seconds, not ISO string
          fromMe: true, // "fromMe" not "role" — matches API response shape
          type: 'chat',
          hasMedia: false,
        },
      ]);

      inputRef.current.value = '';
  };

  // Called by AIResponseReview Edit button, need to hit DB
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
        id: `local_${Date.now()}`,
        body: content, // matches API response shape
        timestamp: Math.floor(Date.now() / 1000), // Unix epoch seconds
        fromMe: true, // matches API response shape
        type: 'chat',
        hasMedia: false,
      },
    ]);

    setResponses((prev) => [
      ...prev.filter((response) => response.content !== content),
    ]);
    console.log(`${content} is removed from AI responses`);
    console.log(responses);
  };

  const handleHeaderChange = (e) => {
    setShowUser(users.find((u) => u.cust_id === e.target.value)); // now works: e.target.value is cust_id (was cust_name before, which never matched)
    console.log(showUser);
  };
  // TODO: need endpoint from sheets team — no existing route handles location updates
  // either extend PATCH /customers/batch-status to accept location, or add a new endpoint
  const handleLocationChange = (e) => {
    return;
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setShowUser(prev => ({...prev, status: newStatus}));
    try {
      const headers = await getAuthHeader();
      await axios.patch(`${API_URL}/customers/batch-status`, {
        updates: [{ cust_id: showUser.cust_id, status: newStatus }]
      }, { headers });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <LeadHeader
          user={showUser}
          users={users}
          onHeaderChange={handleHeaderChange}
        />
        <div className="grid grid-cols-[240px_1fr] gap-4 items-start">
          <ContactInfo
            user={showUser}
            onLocationChange = {handleLocationChange}
            onStatusChange = {handleStatusChange}
            statusList = {statusList} />
          <div className="flex flex-col gap-3">
            <StatusCards
              platformName="whatsapp"
              status={platformStatus.whatsapp}
              onUpdate={handleUpdateStatus}
            />
            {isConnected ? (
              <ConvoHistory
                messages={messages}
                inputRef={inputRef}
                onSend={handleSendMessage}
                onEnter={handleEnterMessage}
              />
            ) : (
              <div className="card bg-base-100 shadow-sm p-6 text-center">
                <h2 className="font-semibold">Not Connected to WhatsApp</h2>
                <p className="text-sm text-base-content/50 mt-1">Connect above to view conversation history.</p>
              </div>
            )}
          </div>
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
