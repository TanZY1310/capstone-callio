function SheetsCard() {
  return (
    <div>
      <div className="card bg-red-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="card-title text-black">Google Sheets API</legend>
        <br />
        <label className="label text-black font-bold text-sm ">API Key</label>
        <div type="text" className="input" placeholder="My awesome page">
          **************
        </div>

        <label className="label text-black font-bold text-sm">
          Spreadsheet ID
        </label>
        <div type="text" className="input" placeholder="My awesome page">
          Sheet1
        </div>
        <br />
        <button className="btn btn-neutral">🤝Sync Now</button>
      </div>
    </div>
  );
}

export default SheetsCard;
