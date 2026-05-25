function ContactInfo({user}){

  {/*throughout the components under LeadDetail.jsx should use the same dummy data.js*/}


    return(
    <><div className="grid grid-cols-[150px_1fr_2fr] gap-4">
        <div className="flex flex-col justify-start ml-20 pl-4 pt-2 card w-96 bg-base-100 shadow-sm">
          <h2>Contact Information</h2>
          <p>Email: {user.contact.email}</p>
          <p>Phone: {user.contact.phone}</p>
          <p>Preferences: {user.contact.preferences}</p>
          <hr />
          <div>
            <span className="pt-3">Current Status </span>
            <div className="flex justify-end">
              <button className="flex justify-end btn-xs">
                {user.status}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>);
}

export default ContactInfo;
