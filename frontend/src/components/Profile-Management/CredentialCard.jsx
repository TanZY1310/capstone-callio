function CredentialCard() {
  const agent = {
    renNumber: 123456,
    agency: "AIA",
  };

  return (
    <div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Professional Details</legend>

        <label className="label">License Number</label>
        <input
          type="text"
          className="input"
          placeholder="My awesome page"
          value={agent.renNumber}
        />

        <label className="label">Agency Branch</label>
        <input
          type="text"
          className="input"
          placeholder="my-awesome-page"
          value={agent.agency}
        />
      </fieldset>
    </div>
  );
}

export default CredentialCard;
