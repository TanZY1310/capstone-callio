function SocialCard() {
  return (
    <div>
      <fieldset className="$$fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="$$fieldset-legend">WhatsApp Business API</legend>

        <label className="$$label">Account ID</label>
        <input
          type="text"
          className="$$input"
          placeholder="Enter Business ID"
        />

        <label className="$$label">Message Template</label>
        <input type="text" className="$$input" placeholder="" />

        <button className="btn btn-success">⛓️‍💥Link Account</button>
      </fieldset>
    </div>
  );
}

export default SocialCard;
