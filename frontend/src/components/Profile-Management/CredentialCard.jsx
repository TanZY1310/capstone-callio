function CredentialCard() {
  const agent = {
    renNumber: 123456,
    agency: "AIA",
  };

  return (
    <div>
      <div className="card bg-base-300 border-base-300 rounded-box w-xs border p-4">
        <h2 className="card-title text-black">Professional Details</h2>
        <br />
        <label className="label">License Number</label>
        <p className="text-sm text-left">123456</p>

        <label className="label">Agency Branch</label>
        <p className="text-sm text-left">AIA</p>
      </div>
    </div>
  );
}

export default CredentialCard;
//
