function SocialCard() {
  return (
    <div>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">WhatsApp Business API</legend>

        <label className="label">Account ID</label>
        <input type="text" className="input" placeholder="Enter Business ID" />

        <label className="label">Message Template</label>
        <input type="text" className="input" placeholder="" />

        <button
          className="btn"
          onClick={() => document.getElementById("link-account").showModal()}
        >
          ⛓️‍💥Link Account
        </button>
        <dialog id="link-account" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg">Link Successfully</h3>
            <p className="py-4">Click the button below to close</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </fieldset>
    </div>
  );
}

export default SocialCard;
