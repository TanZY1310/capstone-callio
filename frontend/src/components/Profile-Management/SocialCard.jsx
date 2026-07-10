import { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';
import wsLogo from '../../assets/Whatsapp.png';
// import loadimg from "../../assets/loading.lottie";

function SocialCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(false);
  const [isLinked, setIsLinked] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [pollInterval, setPollInterval] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/whatsapp/status`);
        if (res.data && res.data.status === 'connected') {
          setIsLinked(true);
        } else {
          setIsLinked(false);
        }
      } catch (err) {
        setIsLinked(false);
        console.error('Failed to fetch initial WhatsApp status:', err);
      }
    };
    
    fetchStatus();
  }, [API_URL]);

  const link = async () => {
    setIsLoading(true);
    setError(null);
    setQrCode(null);
    setNotification(false);

    try {
      const res = await axios.post(`${API_URL}/whatsapp/connect`);
      
      if (res.data && res.data.status === 'error') {
        throw new Error(res.data.message || 'Account failed to link, Please try again');
      }

      setIsLoading(false); // Stop loader, start polling for QR

      const poll = setInterval(async () => {
        try {
          const statusRes = await axios.get(`${API_URL}/whatsapp/status`);
          const data = statusRes.data;

          if (data.status === 'connected') {
            clearInterval(poll);
            setPollInterval(null);
            setQrCode(null);
            setIsLinked(true);
            setNotification(true);
          } else if (data.qr) {
            setQrCode(data.qr);
          }
        } catch (pollErr) {
          clearInterval(poll);
          setPollInterval(null);
          setError('Failed to fetch WhatsApp status');
        }
      }, 3000);
      
      setPollInterval(poll);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Account failed to link, Please try again');
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    document.getElementById('ws-acc').showModal();
    await link(); 
  };

  const handleClose = () => {
    setError(null);
    setNotification(false);
    setQrCode(null);
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
  };

  return (
    <div>
      {/* Main DaisyUI Card Component */}
      <div className="card w-full bg-base-100 border border-base-200 shadow-sm h-full backdrop-blur-md">
        <div className="card-body p-6 gap-5">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="w-10 rounded-lg bg-success-icon/10 p-1.5">
                  <img src={wsLogo} alt="WhatsApp Business" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-base-content">
                  WhatsApp Business API
                </h3>
                <p className="text-xs text-base-content/60">
                  Instant customer outreach and notifications.
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`badge ${isLinked ? 'bg-success-icon text-white border-none' : 'badge-neutral badge-outline'} py-3 text-xs uppercase font-mono tracking-wider`}
            >
              {isLinked ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Account ID Field */}
          <div className="form-control w-full">
            <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
              Account ID
            </label>
            <input
              type="text"
              placeholder="Enter Business ID"
              className="input input-bordered w-full text-sm"
            />
          </div>

          {/* Form Checkbox Control */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3 p-0">
              <input
                type="checkbox"
                className="checkbox checkbox-success checkbox-sm rounded"
              />
              <span className="label-text text-xs text-base-content/80">
                Enable AI Auto-responder
              </span>
            </label>
          </div>

          {/* Primary CTA Action Button */}
          <div className="card-actions mt-auto">
            <button
              className="btn bg-success-icon text-white w-full normal-case font-medium gap-2 shadow-sm"
              onClick={handleLinkAccount}
            >
              <span className="material-symbols-outlined text-xl">
                change_circle
              </span>
              Link Account
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Responsive Modal Component */}
      <dialog id="ws-acc" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box text-center p-8 max-w-sm">
      
          {/* QR Code View State */}
          {qrCode && !notification && !error && (
            <div className="flex flex-col items-center gap-4 py-4">
              <h3 className="font-bold text-lg text-base-content">
                Scan QR Code to Connect
              </h3>
              <div className="bg-white p-4 rounded-xl shadow-sm inline-block">
                <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
              </div>
              <p className="text-sm text-base-content/70 animate-pulse">
                Waiting for scan...
              </p>
            </div> 
          )}

          {/* Waiting for QR Code (Generating / Loading) */}
          {!qrCode && !notification && !error && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-32 h-32">
                <DotLottieReact
                  src="https://lottie.host/a3a5b193-163d-4f12-8df5-0f3fa1fdec52/Pw0g1Q51pn.lottie"
                  loop
                  autoplay
                />
              </div>
              <p className="text-sm font-medium text-base-content/70 animate-pulse">
                Generating QR Code...
              </p>
            </div>
          )}

          {/* Success View State */}
          {notification && !error && (
            <div className="space-y-3 py-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-icon/10 text-success-icon mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-base-content">
                WhatsApp Successfully Linked!
              </h3>
              <p className="text-xs text-base-content/60 leading-relaxed">
                Your connection is live. Press ESC or click below to return to
                dashboards.
              </p>
            </div>
          )}

          {/* Error View State */}
          {error && (
            <div className="space-y-3 py-2">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-icon/10 text-error-icon mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-error-icon">Linking Failed!</h3>
              <p className="text-sm font-medium text-error-icon/80 bg-error-icon/5 py-2 rounded-lg border border-error-icon/10">
                {error}
              </p>
             
            </div>
          )}

          {/* Modal Action Area */}
          <div className="modal-action justify-center mt-6">
            <form method="dialog">
              <button
                className={`btn min-w-30 ${notification && !error ? 'btn-success text-white' : 'btn-ghost border border-base-300'}`}
                onClick={handleClose}
                disabled={isLoading}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SocialCard;
