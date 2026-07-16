import AIResponseReview from '../components/LeadWhatsapp/AIResponseReview.jsx';
import ContactInfo from '../components/LeadWhatsapp/ContactInfo.jsx';
import ConvoHistory from '../components/LeadWhatsapp/ConvoHistory.jsx';
import LeadHeader from '../components/LeadWhatsapp/LeadHeader.jsx';
import StatusCards from '../components/Home/StatusCards.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { statusList } from '../data/statusList.js';
import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import { SendHorizontal } from "lucide-react";
//import users from '../data/dummyData.js';
// import dummyWAHistory from '../data/dummyWAHistory.js';
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

  const API_URL = import.meta.env.VITE_API_URL;
  const FASTAPI_BASE_URL = `${API_URL}/whatsapp`;
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

  // Load AI response drafts when user changes
  useEffect(() => {
    if (!showUser || showUser.id === 0) return;

    const fetchDrafts = async () => {
      try {
        const res = await axios.get(
          `${FASTAPI_BASE_URL}/airesponse/${showUser.cust_id}`,
        );
        setResponses(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Failed to fetch AI response drafts:', error);
        setResponses([]);
      }
    };

    fetchDrafts();
  }, [showUser]);

  // Single source of truth for reading + applying WhatsApp connection status,
  // shared by the initial mount check and the post-connect poll below so the
  // "isConnected / platformStatus" update logic doesn't live in two places.
  const checkConnectionStatus = useCallback(async () => {
    try {
      const res = await axios.get(`${FASTAPI_BASE_URL}/status`);
      const data = res.data;
      const connected = data?.status === 'connected';

      setIsConnected(connected);
      setPlatformStatus((prev) => ({
        ...prev,
        whatsapp: {
          connectionStatus: connected
            ? STATUS_NAME.CONNECTED
            : STATUS_NAME.NOT_CONNECTED,
          lastSync: connected ? Date.now() : prev.whatsapp.lastSync,
        },
      }));

      return data;
    } catch (err) {
      console.error('Failed to fetch WhatsApp status:', err);
      setIsConnected(false);
      return null;
    }
  }, [FASTAPI_BASE_URL]);

  // Check status once on mount so an already-connected backend doesn't
  // require clicking "Connect" again just to sync frontend state.
  useEffect(() => {
    const check = async () => {
      await checkConnectionStatus();
    };
    check();
  }, [checkConnectionStatus]);

  const handleUpdateStatus = async () => {
    //start whatsapp client, change to axios method later
    await axios.post(`${FASTAPI_BASE_URL}/connect`);
    setShowQrModal(true);

    // Poll /status until connected, reusing the same status-check logic
    const poll = setInterval(async () => {
      const data = await checkConnectionStatus();

      if (data?.status === 'connected') {
        clearInterval(poll);
        setQrCode(null);
        setShowQrModal(false);
      } else if (data?.qr) {
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

  // Called by AIResponseReview Generate button
  const handleGenerateAIResponse = async () => {
    try {
      const res = await axios.post(
        `${FASTAPI_BASE_URL}/airesponse/${showUser.cust_id}/generate`,
      );
      setResponses((prev) => [...prev, res.data]);
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    }
  };

  // Called by AIResponseReview Regenerate button
  const handleRegenerateAIResponse = async (responseId) => {
    try {
      const res = await axios.post(
        `${FASTAPI_BASE_URL}/airesponse/${showUser.cust_id}/${responseId}/regenerate`,
      );
      setResponses((prev) =>
        prev.map((r) => (r.response_id === responseId ? res.data : r)),
      );
    } catch (error) {
      console.error('Failed to regenerate AI response:', error);
    }
  };

  // Called by AIResponseReview Edit button
  const handleEditAIResponse = async (id, newText) => {
    try {
      const res = await axios.patch(
        `${FASTAPI_BASE_URL}/airesponse/${showUser.cust_id}/${id}`,
        { content: newText },
      );
      setResponses((prev) =>
        prev.map((r) => (r.response_id === id ? res.data : r)),
      );
    } catch (error) {
      console.error('Failed to save AI response edit:', error);
    }
  };

  // Called by AIResponseReview Confirm button
  const handleConfirmAIResponse = async (id) => {
    try {
      const res = await axios.post(
        `${FASTAPI_BASE_URL}/airesponse/${showUser.cust_id}/${id}/confirm`,
      );
      const confirmed = res.data;

      setMessages((prev) => [
        ...prev,
        {
          id: `local_${Date.now()}`,
          body: confirmed.content, // matches API response shape
          timestamp: Math.floor(Date.now() / 1000), // Unix epoch seconds
          fromMe: true, // matches API response shape
          type: 'chat',
          hasMedia: false,
        },
      ]);

      setResponses((prev) => prev.filter((r) => r.response_id !== id));
    } catch (error) {
      console.error('Failed to confirm AI response:', error);
    }
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
            onGenerate={handleGenerateAIResponse}
            onEdit={handleEditAIResponse}
            onRegenerate={handleRegenerateAIResponse}
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
