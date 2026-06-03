import { statusList } from "../../data/statusList.js";

function ContactInfo({ user }) {
  const updateUserStatus = (e) => {
    return;
  };

  return (
    <div className="flex flex-col rounded-2xl justify-start mt-5 p-4 card w-flex bg-base-100 shadow-sm">
      <p className="font-semibold text-sm text-base-content">
        Contact Information
      </p>
      <div className="text-sm text-base-content/60 mt-1 space-y-1">
        <p>Email: {user.contact.email}</p>
        <p>Phone: {user.contact.phone}</p>
        <p contentEditable="true">Preferences: {user.contact.preferences}</p>
      </div>
      <hr className="my-2 border-base-300" />
      <div>
        <span className="text-xs text-base-content/40">Current Status</span>
        <div className="flex justify-end">
          <select
            className="select select-bordered select-xs btn btn-xs mb-2 mr-2"
            onChange={updateUserStatus}
          >
            {statusList.map((eachStatus) => (
              <option key={eachStatus.id} value={eachStatus.name}>
                {eachStatus.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
