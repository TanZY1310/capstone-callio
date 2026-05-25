function SheetsCard() {
  return (
    <div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Google Sheets API</legend>

        <label className="label">API Key</label>
        <input type="text" class="input" placeholder="API Key" />

        <label className="label">Spreadsheet ID</label>
        <input type="text" class="input" placeholder="Spreadsheet ID" />

        <button className="btn btn-neutral">🤝Sync Now</button>
      </fieldset>
    </div>
  );
}

export default SheetsCard;
