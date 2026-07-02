import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import sheetsimg from '../../assets/sheets_icon.png';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';

function SheetsCard() {
  const [sheetsId, setSheetsId] = useState('');
  const [isLinked, setIsLinked] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('2026-05-12 14:22:10');

  const { user } = useAuth();

  const fetchProfile = async () => {
    if (user) {
      try {
        const response = await api.get('/user_profile/');
        if (response.data.sheets_id) {
          setSheetsId(response.data.sheets_id);
        }

        try {
          const statusRes = await api.get('/sheets/status');
          if (statusRes.data && statusRes.data.connected) {
            setIsLinked(true);
          } else {
            setIsLinked(false);
          }
        } catch (statusErr) {
          setIsLinked(false);
          console.error('Failed to fetch Sheets status:', statusErr);
        }
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleSync = async () => {
    if (!sheetsId || !sheetsId.trim()) {
      toast.error('You must key in the Spreadsheet ID');
      return;
    }

    setIsSyncing(true);

    try {
      if (user) {
        await api.put('/user_profile/', { sheets_id: sheetsId });
        await api.post('/sync');
        setIsLinked(true);
        toast.success(`Sync successful`);
      }

      // Format current time: YYYY-MM-DD HH:mm:ss
      const now = new Date();
      const formattedTime =
        now.getFullYear() +
        '-' +
        String(now.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(now.getDate()).padStart(2, '0') +
        ' ' +
        String(now.getHours()).padStart(2, '0') +
        ':' +
        String(now.getMinutes()).padStart(2, '0') +
        ':' +
        String(now.getSeconds()).padStart(2, '0');

      setLastSyncTime(formattedTime);

      // Fetch the updated profile and status after sync
      await fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync Sheets ID.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div>
      {/* Main Card */}
      <div className="card w-full bg-base-100 border border-base-200 shadow-sm h-full backdrop-blur-md">
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
                <h3 className="text-base font-bold text-base-content flex items-center gap-1.5">
                  Google Sheets API
                  <div
                    className="tooltip tooltip-right flex items-center before:text-xs before:font-normal"
                    data-tip="How to get spreadsheet id"
                  >
                    <Info
                      className="h-4 w-4 text-base-content/50 cursor-pointer hover:text-base-content transition-colors"
                      onClick={() =>
                        document.getElementById('sheets_info_modal').showModal()
                      }
                    />
                  </div>
                </h3>
                <p className="text-xs text-base-content/60">
                  Automated lead export and data syncing.
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`badge ${isLinked ? 'badge-success text-white border-none' : 'badge-neutral badge-outline'} py-3 text-xs uppercase font-mono tracking-wider`}
            >
              {isLinked ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Form / Credentials Section */}
          <div className="flex flex-col gap-4">
            <div className="form-control w-full">
              <label className="label text-[10px] font-bold uppercase tracking-wider text-base-content/40 p-0 mb-1.5">
                Spreadsheet ID
              </label>
              <input
                type="text"
                placeholder="Enter Spreadsheet ID"
                className="input input-bordered w-full text-sm"
                value={sheetsId}
                onChange={(e) => setSheetsId(e.target.value)}
              />
            </div>
          </div>

          {/* Sync Progress Tracker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-semibold">
              <span className="font-bold text-base-content">
                Last Sync Status
              </span>
              <span
                className={`text-base-content/60 font-mono transition-all duration-300 ${isSyncing ? 'animate-pulse text-success' : ''}`}
              >
                {isSyncing ? 'Syncing...' : lastSyncTime}
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
              className={`btn bg-base-content text-base-100 hover:bg-base-content/80 border-none flex-1 normal-case font-medium`}
              disabled={isSyncing}
              onClick={handleSync}
            >
              <RefreshCcw
                className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
              />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <dialog id="sheets_info_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-info" />
            How to find your Spreadsheet ID
          </h3>

          <p className="text-sm text-base-content/80 mb-6">
            Your Spreadsheet ID is the long string of letters and numbers in the
            URL of your Google Sheet. It is located between <strong>/d/</strong>{' '}
            and <strong>/edit</strong>.
          </p>

          <div className="mockup-browser bg-base-200 border border-base-300">
            <div className="mockup-browser-toolbar">
              <div className="input text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
                https://docs.google.com/spreadsheets/d/
                <span className="text-primary font-bold">
                  1Z7DdeF4-CRXSHm9Zeykk44HIAtR5f0D7-ctbqw0HNx8
                </span>
                /edit?gid=0#gid=0
              </div>
            </div>
            <div className="bg-base-100 flex justify-center px-4 py-8 border-t border-base-300">
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">
                  Extracted Spreadsheet ID
                </p>
                <code className="bg-base-200 px-4 py-2 rounded-lg text-primary select-all font-mono shadow-sm">
                  1Z7DdeF4-CRXSHm9Zeykk44HIAtR5f0D7-ctbqw0HNx8
                </code>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SheetsCard;
