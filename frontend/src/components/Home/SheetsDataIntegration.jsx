import { RefreshCw } from 'lucide-react';
import { SiGooglesheets } from 'react-icons/si';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'motion/react';

function SheetsDataIntegration({
  onImport,
  changedRecords = [],
  onExport,
  hasExistingData,
  pendingCount = 0,
}) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  const handleImport = async () => {
    if (pendingCount > 0) {
      const msg =
        `You have ${pendingCount} unsaved change${pendingCount > 1 ? 's' : ''}. ` +
        'Importing may overwrite local changes. Continue?';
      if (!window.confirm(msg)) return;
    }
    setImporting(true);
    try {
      await onImport(); // parent will call POST /sheets/sync
      toast.success('Data imported successfully.');
    } catch (err) {
      handleSheetsError(err, 'Import');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await onExport?.();
      document.getElementById('export_confirm_modal').close();
      toast.success('Data exported to Google Sheets');
    } catch (err) {
      handleSheetsError(err, 'Export');
    } finally {
      setExporting(false);
    }
  };

  const handleSheetsError = (err, label) => {
    const detail = err?.response?.data?.detail || '';
    if (detail.includes('SHEETS_ID_MISSING')) {
      toast.error(
        'No spreadsheet linked. Go to Profile to add your spreadsheet ID.',
        {
          action: {
            label: 'Go to Profile',
            onClick: () => navigate('/profile'),
          },
          duration: 8000,
        },
      );
    } else {
      toast.error(`${label} failed. Please try again.`);
    }
    console.log(err);
  };
  return (
    <>
      <motion.div
        className="dashboard-card border border-base-200 p-5"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
              <SiGooglesheets size={25} className="text-success" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Google Sheets Data Transfer
              </p>
              <p className="text-xs text-base-content/40">
                {hasExistingData
                  ? 'Re-sync data from Google Sheets'
                  : 'No customers found - Import from Google Sheets to get started'}
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="badge badge-warning badge-sm">
              {pendingCount} unsaved change{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-success flex-1"
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Importing{''}
                ...
              </>
            ) : (
              <>
                <RefreshCw size={15} />{' '}
                {hasExistingData
                  ? 'Re-Sync Google Sheets Data'
                  : 'Import From Google Sheets'}
              </>
            )}
          </button>
          {/* Export — opens modal */}
          <button
            className="btn btn-warning flex-1"
            disabled={exporting}
            onClick={() =>
              document.getElementById('export_confirm_modal').showModal()
            }
          >
            <RefreshCw size={15} />
            Export To Google Sheets
            {pendingCount > 0 && (
              <span className="badge badge-warning badge-sm ml-1">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>
      {/* ✅ Export confirmation modal */}
      <dialog id="export_confirm_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg text-base-content mb-1">
            Confirm Export
          </h3>
          <p className="text-sm text-base-content/50 mb-4">
            {changedRecords.length > 0
              ? `The following ${changedRecords.length} record${changedRecords.length > 1 ? 's' : ''} with status changes will be synced to Google Sheets:`
              : ``}
          </p>

          {/* Summary table — only show when there are local status changes */}
          {changedRecords.length > 0 && (
            <div className="overflow-x-auto max-h-64">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="text-xs text-base-content/40">
                    <th>Customer</th>
                    <th>Previous Status</th>
                    <th>New Status</th>
                  </tr>
                </thead>
                <tbody>
                  {changedRecords.map((record) => (
                    <tr key={record.cust_id}>
                      <td className="text-sm font-medium text-base-content">
                        {record.cust_name}
                      </td>
                      <td>
                        <span className="badge badge-ghost badge-sm">
                          {record.originalStatus || '—'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning badge-sm">
                          {record.newStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm">Cancel</button>
            </form>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />{' '}
                  Exporting...
                </>
              ) : (
                'Confirm Export'
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default SheetsDataIntegration;
