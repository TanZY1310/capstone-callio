import React, { useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import wsLogo from "../../assets/Whatsapp.png";
// import loadimg from "../../assets/loading.lottie";

function SocialCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(false);

  const link = async () => {
    setIsLoading(true);
    setError(null);

    try {
      //simulate API calling
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() > 0.3) {
        console.log("Linked Succesfully");
        setNotification(true);
      } else {
        throw new Error("Account failed to linked, Please try again");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkAccount = async () => {
    document.getElementById("ws-acc").showModal();
    await link();
  };

  const handleClose = () => {
    setError(null);
    setNotification(false);
  };

  return (
    <div>
      <div className="w-152 rounded-2xl border border-[#E2E8F0] bg-white/70 p-8 shadow-sm backdrop-blur-md flex flex-col gap-6 m-5 mt-1 ">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8FBF0]">
              <img src={wsLogo} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                WhatsApp Business API
              </h3>
              <p className="text-xs text-slate-500">
                Instant customer outreach and notifications.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-mono tracking-wider text-base-400 uppercase">
            Disconnected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Account ID
              </label>
              <input
                type="text"
                placeholder="Enter Business ID"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Message Template
              </label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none">
                  <option>New Lead Greeting</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500"></div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600">
                Enable AI Auto-responder
              </span>
            </label>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50/50">
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
              <div className="h-16 w-16 opacity-60"></div>
            </div>
            <p className="text-center text-3xs text-slate-400 leading-normal max-w-40">
              Scan QR code with your WhatsApp Business app to link Account
            </p>
          </div>
        </div>

        <button
          className=" flex w-full 
        items-center justify-center gap-2 rounded-lg bg-[#00E676] 
        hover:bg-[#00c864] py-3 text-sm font-medium text-white transition-colors shadow-sm"
          onClick={handleLinkAccount}
        >
          <span className="material-symbols-outlined">change_circle</span>
          Link Account
        </button>
      </div>
      <dialog id="ws-acc" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          {isLoading && (
            <div>
              <DotLottieReact
                src="https://lottie.host/a3a5b193-163d-4f12-8df5-0f3fa1fdec52/Pw0g1Q51pn.lottie"
                loop
                autoplay
              />
              <p>Linking Account...</p>
            </div>
          )}
          {notification && !error && (
            <div>
              <h3 className="font-bold text-lg">
                WhatsApp Succesfully Linked !
              </h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
            </div>
          )}

          {/* shows when there's an error */}
          {error && (
            <div>
              <h3 className="font-bold text-lg text-red-500">
                Linking Failed!
              </h3>
              <p className="py-4 text-red-400">{error}</p>
              <p className="text-sm text-slate-500">Please try again.</p>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleClose}>
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
