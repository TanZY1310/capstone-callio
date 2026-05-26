function ContactInfo({ user }) {
  {
    /*throughout the components under LeadDetail.jsx should use the same dummy data.js*/
  }

  return (
    <>
      <div>
        <div className="flex flex-col justify-start ml-18 mt-5 pl-4 pt-4 card w-96 bg-[#FFFFFF] shadow-sm">
          <h2 style={{ color: "#000000" }}>Contact Information</h2>
          <div style={{ color: "#45464D" }}>
            <p>Email: {user.contact.email}</p>
            <p>Phone: {user.contact.phone}</p>
            <p>Preferences: {user.contact.preferences}</p>
          </div>
          <hr />
          <div>
            <span className="pt-3" style={{ color: "#45464D" }}>Current Status </span>
            <div className="flex justify-end">
              <button className="flex justify-end btn btn-xs mb-2 mr-2">{user.status}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactInfo;
