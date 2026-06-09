import react, { useState } from 'react';
import { Settings, RefreshCcw } from 'lucide-react';
import sheetsimg from '../../assets/sheets_icon.png';

function SheetsCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(false);

  const insert_api = async () => {
    setIsLoading(true);
    setError(null);

    try {
      //simulate API calling
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (Math.random() > 0.3) {
        console.log('Linked Succesfully');
        setNotification(true);
      } else {
        throw new Error('Account failed to linked, Please try again');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    document.getElementById('setting_modal').showModal();
  };

  const handleSave = () => {
    insert_api();
  };

  return (
    <div>
      {/* Main Card */}
      <div className="card w-full bg-base-100 border border-neutral-200 shadow-sm h-full backdrop-blur-md">
        <div className="card-body p-6 gap-5">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="w-10 rounded-lg bg-success/10 p-1.5">
                  <img src={sheetsimg} alt="Google Sheets" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-base-content">
                  Google Sheets API
                </h3>
                <p className="text-xs text-base-content/60">
                  Automated lead export and data syncing.
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span className="badge badge-success badge-outline font-mono gap-1.5 py-3 text-xs uppercase tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
              Connected
            </span>
          </div>

          {/* Form / Credentials Section */}
          <div className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                value="sk_live_11MvXU7Kk83VzNqP1xX..."
                disabled
                className="input input-bordered bg-base-200/50 text-xs font-mono w-full"
              />
            </div>

            <div className="form-control w-full">
              <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
                Spreadsheet ID
              </label>
              <input
                type="text"
                value="1x9jLp8qZ-5_R8vA_m2Xy7w..."
                disabled
                className="input input-bordered bg-base-200/50 text-xs font-mono w-full"
              />
            </div>
          </div>

          {/* Sync Progress Tracker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-semibold">
              <span className="font-bold text-base-content">
                Last Sync Status
              </span>
              <span className="text-base-content/60 font-mono">
                2026-05-12 14:22:10
              </span>
            </div>
            <progress
              className="progress progress-success w-full"
              value="100"
              max="100"
            ></progress>
          </div>

          {/* Action Footer */}
          <div className="card-actions flex gap-2.5 pt-1">
            <button
              className={`btn btn-neutral flex-1 normal-case font-medium ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {!isLoading && <RefreshCcw className="w-4 h-4" />}
              Sync Now
            </button>

            <button
              className="btn btn-square btn-outline border-neutral-200 hover:bg-base-200 text-base-content/70"
              onClick={handleClick}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* DaisyUI Settings Modal */}
      <dialog id="setting_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-md">
          {/* Close button inside form context */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4">Update API Configuration</h3>

          {error && (
            <div className="alert alert-error text-xs py-2 mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="form-control w-full">
              <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                placeholder="Enter your live secret API Key"
                className="input input-bordered w-full text-xs font-mono"
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
                Spreadsheet ID
              </label>
              <input
                type="text"
                placeholder="Enter Google Spreadsheet ID"
                className="input input-bordered w-full text-xs font-mono"
                required
              />
            </div>

            <div className="modal-action justify-center pt-2">
              <button
                type="submit"
                className={`btn btn-neutral px-8 ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                Save & Link Key
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close helper */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default SheetsCard;
