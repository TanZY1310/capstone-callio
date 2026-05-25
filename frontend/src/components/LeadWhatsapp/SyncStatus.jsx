import { useState } from "react";

function SyncStatus() {
  /*simulate API calling and handle the show connected, date, etc.*/
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
          googleSheets: {
            connected: true,
            lastSync: `${lastSync}`,
            whatsapp: { connected: true, lastSync: `${lastSync}` },
          },
        }));
        break;
      default:
        console.log("Nothing is synced.");
        break;
    }
  };

  /*I need conditional rendering to prompt connect / show when is it connnected*/
  return (
    <>
      <div className="flex flex-col ml-18 mt-5 w-96 bg-[#FFFFFF] shadow-sm rounded-xl overflow-hidden">
        <div className="flex justify-between items-center pl-4 pr-4 pt-3 pb-3">
          <h2 style={{ color: "#000000" }}>Sync Status</h2>
          <button className="btn btn-xs text-[#57657B]">Refresh</button>
        </div>
        <div className="flex flex-col gap-3 p-4">
          {syncStatus.googleSheets.connected ? (
            <div className="bg-[#F2F4F6]">Last Sync: {Date.now()}</div>
          ) : (
            <div>
              <p>Sheets Not connected</p>
              <button className="btn btn-success" onClick = {(e) =>updateSyncStatus('google sheets', Date.now())}>Connect Google Sheets</button>
            </div>
          )}
          {syncStatus.whatsapp.connected ? (
            <div className="bg-[#F2F4F6]">Last Sync: {Date.now()}</div>
          ) : (
            <div>
              <p>Whatsapp Not connected</p>
              <button className="btn btn-success" onClick = {(e) => updateSyncStatus('whatsapp', Date.now())}>Connect Whatsapp</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SyncStatus;
