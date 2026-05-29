function ContactInfo({ user }) {
  return (
    <div className="flex flex-col justify-start ml-18 mt-5 pl-4 pt-4 card w-flex bg-base-100 shadow-sm">
      <h2 className="text-base-content">Contact Information</h2>
      <div className="text-base-content/70">
        <p>Email: {user.contact.email}</p>
        <p>Phone: {user.contact.phone}</p>
        <p>Preferences: {user.contact.preferences}</p>
      </div>
      <hr className="my-2 border-base-300" />
      <div>
        <span className="pt-3 text-base-content/70">Current Status</span>
        <div className="flex justify-end">
          <button className="btn btn-xs mb-2 mr-2">{user.status}</button>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
