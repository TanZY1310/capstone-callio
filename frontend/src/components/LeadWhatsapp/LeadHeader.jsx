function LeadHeader({ user }) {
  const openWhatsapp = (e) => {
    e.preventDefault();
    console.log("Opening whatsapp..."); //need to link to whatsapp page in the future
  };

  return (
    <div className="flex justify-between items-center pl-18 pt-6 pb-6 bg-base-100">
      <div className="flex justify-start">
        <h2 className="text-base-content">Lead Pipeline - {user.name}</h2>
      </div>
      <div className="flex justify-end">
        <button className="btn btn-md btn-success mr-4" onClick={openWhatsapp}>
          Open Whatsapp
        </button>
      </div>
    </div>
  );
}

export default LeadHeader;
