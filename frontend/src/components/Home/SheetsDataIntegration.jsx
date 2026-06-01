import { RefreshCw } from "lucide-react";
import sampleCustomers from "../../data/SampleCustomers";
import { SiGooglesheets } from "react-icons/si";

function SheetsDataIntegration({ onButtonClick }) {
  const handleClick = () => {
    const customerData = sampleCustomers;
    console.log("Button sync data has been clicked.");
    console.log("Customer data from button: " + customerData);

    //Call parent function to send value back to parent component
    onButtonClick(customerData);
  };
  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
            <SiGooglesheets size={25} className="text-success" />
          </div>
          <div>
            <p className="font-semibold text-sm">Google Sheets Data Transfer</p>
            <p className="text-xs text-base-content/40">
              Click on sync data to import data from Google Sheets
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          className="btn btn-soft btn-success flex"
          onClick={handleClick}
        >
          <RefreshCw size={15} />
          Import Data From Google Sheets
        </button>
        <button
          className="btn btn-soft btn-success flex"
          // onClick={handleClick}
        >
          <RefreshCw size={15} />
          Upload Data To Google Sheets
        </button>
      </div>
    </div>
  );
}

export default SheetsDataIntegration;
