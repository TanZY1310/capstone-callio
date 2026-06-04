import { RefreshCw } from "lucide-react";
import sampleCustomers from "../../data/SampleCustomers";
import { SiGooglesheets } from "react-icons/si";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";

function SheetsDataIntegration({ onImport, changedRecords = [], onExport }) {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // TODO implement fetch backend Google Sheets API here
  const handleImport = async () => {
    setImporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //Call parent function to send value back to parent component (HomePage)
      onImport(sampleCustomers);
      toast.success("Data imported successfully.");
    } catch (err) {
      toast.error("Import failed. Please try again.");
      console.log(err);
    } finally {
      setImporting(false);
    }
  };

  // TODO implement fetch backend Google Sheets API here
  const handleExport = async () => {
    setExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onExport?.();
      document.getElementById("export_confirm_modal").close();
      toast.success("Data exported to Google Sheets");
    } catch (err) {
      toast.error("Export failed. Please try again.");
      console.log(err);
    } finally {
      setExporting(false);
    }
  };
  return (
    <>
      <motion.div
        className="bg-base-100 rounded-2xl border border-base-200 p-5"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}>
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
                Import from or export data back to Google Sheets
              </p>
            </div>
          </div>
          {/* ✅ Badge showing pending changes */}
          {changedRecords.length > 0 && (
            <span className="badge badge-warning badge-sm">
              {changedRecords.length} unsaved change
              {changedRecords.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-soft btn-success flex-1"
            onClick={handleImport}
            disabled={importing}>
            {importing ? (
              <>
                <span className="loading loading-spinner loading-sm" />Importing{""}
                ...
              </>
            ) : (
              <>
                <RefreshCw size={15} /> {" "} Import From Google Sheets
              </>
            )}
          </button>
          {/* Export — opens modal */}
          <button
            className="btn btn-soft btn-warning flex-1"
            disabled={changedRecords.length === 0 || exporting}
            onClick={() =>
              document.getElementById("export_confirm_modal").showModal()
            }>
            <RefreshCw size={15} />
            Upload To Google Sheets
            {changedRecords.length > 0 && (
              <span className="badge badge-warning badge-sm ml-1">
                {changedRecords.length}
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
            The following {changedRecords.length} record
            {changedRecords.length > 1 ? "s" : ""} will be updated in Google
            Sheets:
          </p>

          {/* Summary table */}
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
                  <tr key={record.id}>
                    <td className="text-sm font-medium text-base-content">
                      {record.name}
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {record.originalStatus || "—"}
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

          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm">Cancel</button>
            </form>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleExport}
              disabled={exporting}>
              {exporting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />{" "}
                  Exporting...
                </>
              ) : (
                "Confirm Export"
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
