import UserPreferences from './UserPreferences.jsx';

function ContactInfo({ user, onLocationChange, onStatusChange, statusList}) {
 
  return (
    <div className="dashboard-card flex flex-col justify-start p-4">
      <p className="font-semibold text-md text-base-content">
        Contact Information
      </p>
      <div className="text-sm text-base-content/60 mt-1 space-y-1">
        <p>Phone: {user.phone}</p>
        <p>Preferences:</p>
        {UserPreferences(user.location)}
        <div className="flex justify-end">
          <button
            className="btn btn-success btn-xs mt-1 mb-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            fdprocessedid="ufksnr"
            onSubmit={onLocationChange}
          >
            Submit
          </button>
        </div>
      </div>
      <hr className="my-2 border-base-300" />
      <div>
        <span className="text-xs text-base-content/40">Current Status</span>
        <div className="flex justify-end">
          <select
            className="select select-bordered select-xs btn btn-xs mb-2 mr-2"
            value = {user.status}
            onChange={onStatusChange}
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
