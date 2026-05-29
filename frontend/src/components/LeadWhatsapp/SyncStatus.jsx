import { useState } from "react";

function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState({
    googleSheets: { connected: false, lastSync: "" },
    whatsapp: { connected: false, lastSync: "" },
  });

  const updateSyncStatus = (platform, lastSync) => {
    switch (platform.toLowerCase().trim()) {
      case "google sheets":
        setSyncStatus((prev) => ({
          ...prev,
          googleSheets: { connected: true, lastSync: `${lastSync}` },
        }));
        break;
      case "whatsapp":
        setSyncStatus((prev) => ({
          ...prev,
          whatsapp: { connected: true, lastSync: `${lastSync}` },
        }));
        break;
      case "both":
        setSyncStatus((prev) => ({
          ...prev,
          googleSheets: { connected: true, lastSync: `${lastSync}` },
          whatsapp: { connected: true, lastSync: `${lastSync}` },
        }));
        break;
      default:
        console.log("Nothing is synced.");
        break;
    }
  };

  return (
    <div className="flex flex-col ml-18 mt-5 w-flex bg-base-100 shadow-sm rounded-xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-base-content">Sync Status</h2>
        <button className="btn btn-xs text-base-content/50">Refresh</button>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {syncStatus.googleSheets.connected ? (
          <div className="bg-base-200 rounded-lg p-3 text-base-content/70">
            Last Sync: {syncStatus.googleSheets.lastSync}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-base-content/70">Sheets not connected</p>
            <button
              className="btn btn-success btn-sm"
              onClick={() => updateSyncStatus("google sheets", Date.now())}
            >
              Connect Google Sheets
            </button>
          </div>
        )}
        {syncStatus.whatsapp.connected ? (
          <div className="bg-base-200 rounded-lg p-3 text-base-content/70">
            Last Sync: {syncStatus.whatsapp.lastSync}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-base-content/70">WhatsApp not connected</p>
            <button
              className="btn btn-success btn-sm"
              onClick={() => updateSyncStatus("whatsapp", Date.now())}
            >
              Connect WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SyncStatus;
