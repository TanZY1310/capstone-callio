function LeadHeader({user}) {
  const openWhatsapp = (e) => {
    e.preventDefault();
    console.log("Opening whatsapp...");
  };

  {
    /*TO REPLACE Dummy Info In Here For Name & Hyperlink Later*/
  }
  return (
    <>
      <div className="flex justify-between items-center pl-18 pt-6 pb-6">
        <div className="flex justify-start">
          <h2>Lead Pipeline - {user.name}</h2>
        </div>

        <div className="flex justify-end">
          <button
            className="btn btn-md btn-success mr-4"
            onClick={openWhatsapp}
          >
            Open Whatsapp
          </button>
        </div>
      </div>
    </>
  );
}

export default LeadHeader;
