function SocialCard() {
  return (
    <div>
      <fieldset className="$$fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="$$fieldset-legend">Google Sheets API</legend>

        <label className="$$label">Account ID</label>
        <input type="text" className="$$input" placeholder="My awesome page" />

        <label className="$$label">SpreadSheet ID</label>
        <input type="text" className="$$input" placeholder="my-awesome-page" />

        <button className="btn btn-neutral">🤝Sync Now</button>
      </fieldset>
    </div>
  );
}

export default SocialCard;
