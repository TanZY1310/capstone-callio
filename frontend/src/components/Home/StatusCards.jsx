import { SiWhatsapp, SiGooglesheets } from 'react-icons/si';
import { STATUS_NAME } from '../../data/constants';

function StatusCards({ platformName, status, onUpdate }) {
  const isConnected =
    status.connectionStatus === STATUS_NAME.CONNECTED;
  const bgClass = isConnected ? 'bg-success-icon/10' : 'bg-error-icon/10';
  const textClass = isConnected ? 'text-success-icon' : 'text-error-icon';
  const statusDot = isConnected ? 'bg-success-icon' : 'bg-error-icon';

  return (
    <>
      {platformName === 'whatsapp' && (
        <div className="dashboard-card p-8 flex flex-col items-center justify-center gap-4 h-full text-center">
          <div className="w-14 h-14 bg-success-icon/10 rounded-xl flex items-center justify-center">
            <SiWhatsapp size={36} className="text-success-icon" />
          </div>
          <div>
            <p className="font-semibold text-lg text-base-content">
              WhatsApp API
            </p>
            <p
              className={`flex items-center justify-center gap-1.5 text-sm ${textClass} mt-1`}
            >
              <span className="inline-grid *:[grid-area:1/1]">
                <span className={`status ${statusDot} animate-ping`}></span>
                <span className={`status ${statusDot}`}></span>
              </span>{' '}
              {status.connectionStatus}
            </p>
          </div>
          {status.connectionStatus === STATUS_NAME.NOT_CONNECTED ? (
            <button className="btn btn-success" onClick={() => onUpdate()}>
              Connect WhatsApp
            </button>
          ) : (
            <span className="text-sm text-base-content/40">
              Last Sync: {new Date(status.lastSync).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {platformName === 'sheets' && (
        <div className="dashboard-card p-5 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-success-icon/10 rounded-xl flex items-center justify-center">
            <SiGooglesheets size={25} className="text-success-icon" />
            </div>
            <div>
              <p className="font-semibold text-sm text-base-content">
                Google Sheets API
              </p>

              <p
                className={`flex items-center gap-1.5 text-xs ${textClass} mt-0.5`}
              >
                <span className="inline-grid *:[grid-area:1/1]">
                  <span className={`status ${statusDot} animate-ping`}></span>
                  <span className={`status ${statusDot}`}></span>
                </span>{' '}
                {status.connectionStatus}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StatusCards;
