function SocialCard() {
  return (
    <div>
      <div className="card bg-red-200 border-base-300 rounded-box w-xs border p-4">
        <div>
          <legend className="card-title text-black">
            WhatsApp Business API📞
          </legend>
        </div>
        <br />
        <label className="label text-black font-bold text-sm">Account ID</label>
        <input type="text" className="input" placeholder="Enter Business ID" />

        <label className="label text-black font-bold text-sm">
          Message Template
        </label>
        <input type="text" className="input" placeholder="" />
        <br />
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
      </div>
    </div>
  );
}

export default SocialCard;
