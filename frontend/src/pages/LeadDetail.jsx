import AIResponseReview from '../components/LeadWhatsapp/AIResponseReview.jsx';
import ContactInfo from '../components/LeadWhatsapp/ContactInfo.jsx';
import ConvoHistory from '../components/LeadWhatsapp/ConvoHistory.jsx';
import LeadHeader from '../components/LeadWhatsapp/LeadHeader.jsx';
import StatusCards from '../components/Home/StatusCards.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { statusList } from '../data/statusList.js';
import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { SendHorizontal } from "lucide-react";
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

  const FASTAPI_BASE_URL = 'http://127.0.0.1:8000/whatsapp';
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

  const { profile } = useAuth();

  // Load user from navigation state
  useEffect(() => {
    const loading = async () => {
      const customer = state?.customer;
      if (!profile?.user_id) return; // wait until profile is ready
      // const agent = profile.user_id;
      const usersResponse = await axios.get(
        `${FASTAPI_BASE_URL}/details/all/${profile.user_id}`,
      );
      const users = await usersResponse.data;
      const customerFound = customer
        ? users.find((u) => u.cust_id === customer.cust_id)
        : users[0];
      setUsers(users);
      setShowUser(customerFound ?? users[0]);
      console.log(customerFound);
    };

    loading();
  }, [state, profile]);

  // Load chat history when user changes
  useEffect(() => {
    if (!showUser || showUser.id === 0) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          `${FASTAPI_BASE_URL}/history/${showUser.cust_id}`,
        );
        const data = await response.data;
        console.log(JSON.stringify(data, null, 2));
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

    await axios.post(`${FASTAPI_BASE_URL}/send/${showUser.cust_id}`, {
      message: text,
    });

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
    await axios.post(`${FASTAPI_BASE_URL}/send/${showUser.cust_id}`, {
      message: text,
    });

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
    await axios.post(
      `${FASTAPI_BASE_URL}/send/00000000-0000-0000-0000-000000000067`,
      { message: content },
    );
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
    setShowUser((prev) => ({ ...prev, status: newStatus }));
    try {
      await api.patch('/customers/batch-status', {
        updates: [{ cust_id: showUser.cust_id, status: newStatus }],
      });

      await api.post('/sheets/export', {});

    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="flex h-screen bg-base-200">
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <LeadHeader
            user={showUser}
            users={users}
            onHeaderChange={handleHeaderChange}
          />
        </div>
        <div className="flex flex-row gap-4 items-stretch">
          <div className="basis-1/2">
            <ContactInfo
              user={showUser}
              onLocationChange={handleLocationChange}
              onStatusChange={handleStatusChange}
              statusList={statusList}
            />
          </div>
          <div className="basis-1/2 flex flex-col gap-3">
            <StatusCards
              platformName="whatsapp"
              status={platformStatus.whatsapp}
              onUpdate={handleUpdateStatus}
            />
          </div>
        </div>
        {isConnected ? (
          <ConvoHistory
            messages={messages}
            inputRef={inputRef}
            onSend={handleSendMessage}
            onEnter={handleEnterMessage}
          />
        ) : (
          <div className="dashboard-card py-8 px-6 text-center">
            <h2 className="font-semibold">Not Connected to WhatsApp</h2>
            <p className="text-sm text-base-content/50 mt-1">
              Connect above to view conversation history.
            </p>
            <div className="py-4 flex-1 overflow-y-auto max-h-[500px]">
              <div className="chat chat-end">
                <div className="chat-bubble whitespace-pre-wrap">
                  Sample Chat
                </div>
                <div className="chat-footer opacity-50">
                  {new Date().toString()}
                </div>
                
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble whitespace-pre-wrap">
                  Sample Response
                </div>
                <div className="chat-footer opacity-50">
                  {new Date().toString()}
                </div>
              </div>
            </div>
              <div className="flex items-center gap-2 p-4 border-t border-base-300">
              <textarea
                type="text"
                placeholder="Only usable after connecting to whatsapp..."
                className="input input-bordered w-full"
              />
              <button
                className="btn btn-success btn-circle ml-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                <SendHorizontal />
              </button>
            </div>
          </div>
        )}{' '}
        {/*new Date(timestamp × 1000)*/}
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
            <p className="py-2">
              Open WhatsApp → Linked Devices → Link a Device
            </p>
            {qrCode ? (
              <img
                src={qrCode}
                alt="WhatsApp QR"
                className="mx-auto w-64 h-64"
              />
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
