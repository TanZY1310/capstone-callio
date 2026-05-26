import wsLogo from "../../assets/Whatsapp.png";

function SocialCard() {
  return (
    <div>
      <div class="w-152 rounded-2xl border border-[#E2E8F0] bg-white/70 p-8 shadow-sm backdrop-blur-md flex flex-col gap-6">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8FBF0]">
              <img src={wsLogo} />
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800">
                WhatsApp Business API
              </h3>
              <p class="text-xs text-slate-500">
                Instant customer outreach and notifications.
              </p>
            </div>
          </div>
          <span class="rounded-full bg-indigo-50 px-2 py-1 text-xs font-mono tracking-wider text-base-400 uppercase">
            Disconnected
          </span>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Account ID
              </label>
              <input
                type="text"
                placeholder="Enter Business ID"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-2xs font-bold uppercase tracking-wider text-slate-400">
                Message Template
              </label>
              <div class="relative">
                <select class="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none">
                  <option>New Lead Greeting</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500"></div>
              </div>
            </div>

            <label class="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span class="text-xs text-slate-600">
                Enable AI Auto-responder
              </span>
            </label>
          </div>

          <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50/50">
            <div class="mb-3 flex h-24 w-24 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100">
              <div class="h-16 w-16 opacity-60"></div>
            </div>
            <p class="text-center text-3xs text-slate-400 leading-normal max-w-40">
              Scan QR code with your WhatsApp Business app to link Account
            </p>
          </div>
        </div>

        <button
          class=" flex w-full 
        items-center justify-center gap-2 rounded-lg bg-[#00E676] 
        hover:bg-[#00c864] py-3 text-sm font-medium text-white transition-colors shadow-sm"
          onClick={() => document.getElementById("ws-acc").showModal()}
        >
          <span class="material-symbols-outlined">change_circle</span>
          Link Account
        </button>
      </div>
      <dialog id="ws-acc" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">WhatsApp Succesfully Linked !</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SocialCard;
