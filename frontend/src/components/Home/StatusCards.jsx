import { SiWhatsapp, SiGooglesheets } from "react-icons/si";
import { STATUS_NAME } from "../../data/constants";

function StatusCards({ platformName, status, onUpdate }) {
  const color =
    status.connectionStatus === STATUS_NAME.CONNECTED ? "success" : "error";
  const colorClasses = {
    success: {
      bg: "bg-success/10",
      text: "text-success",
      status: "status-success",
    },
    error: {
      bg: "bg-error/10",
      text: "text-error",
      status: "status-error",
    },
  };
  const c = colorClasses[color];

  return (
    <>
      {platformName === "whatsapp" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
              <SiWhatsapp size={25} className={c.text} />
            </div>
            <div>
              <p className="font-semibold text-sm text-base-content">
                WhatsApp API
              </p>

              <p
                className={`flex items-center gap-1.5 text-xs ${c.text} mt-0.5`}>
                <span className="inline-grid *:[grid-area:1/1]">
                  <span className={`status ${c.status} animate-ping`}></span>
                  <span className={`status ${c.status}`}></span>
                </span>{" "}
                {status.connectionStatus}
              </p>
            </div>
          </div>
          {status.connectionStatus === STATUS_NAME.NOT_CONNECTED ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => onUpdate()}>
              Connect WhatsApp
            </button>
          ) : (
            <span className="text-xs text-base-content/40">
              Last Sync: {new Date(status.lastSync).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {platformName === "sheets" && (
        <div className="bg-base-100 rounded-2xl border border-base-200 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center`}>
              <SiGooglesheets size={25} className={c.text} />
            </div>
            <div>
              <p className="font-semibold text-sm text-base-content">
                Google Sheets API
              </p>

              <p
                className={`flex items-center gap-1.5 text-xs ${c.text} mt-0.5`}>
                <span className="inline-grid *:[grid-area:1/1]">
                  <span className={`status ${c.status} animate-ping`}></span>
                  <span className={`status ${c.status}`}></span>
                </span>{" "}
                {status.connectionStatus}
              </p>
            </div>
          </div>
          {status.connectionStatus === STATUS_NAME.NOT_CONNECTED ? (
            <button
              className="btn btn-success btn-sm"
              onClick={() => onUpdate()}>
              Connect Google Sheets
            </button>
          ) : (
            <span className="text-xs text-base-content/40">
              Last Sync: {new Date(status.lastSync).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}
    </>
  );
}

export default StatusCards;
