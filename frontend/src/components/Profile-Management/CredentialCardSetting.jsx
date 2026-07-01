import { useAuth } from '../../hooks/useAuth';

function CredentialCardSetting() {
  const { profile } = useAuth();

  return (
    /* Panel Container matching ProfileCardSetting structural spacing precisely */
    <div className="card bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold tracking-wider text-base-content/70 uppercase">
          Professional Details
        </h3>
      </div>

      {/* Responsive Input Grid: 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* License Number Input */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              License Number / REN
            </span>
          </label>
          <input
            type="text"
            name="license_number"
            key={`license-${profile?.license_number}`}
            defaultValue={profile?.license_number || ''}
            className="input input-bordered w-full bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        {/* Agency Branch Dropdown Selection Box */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Agency Branch
            </span>
          </label>
          <div className="relative w-full">
            <select
              name="agency_branch"
              key={`agency-${profile?.agency_branch}`}
              defaultValue={
                profile?.agency_branch || 'Central District Head Office'
              }
              className="select select-bordered w-full bg-base-100 border-base-300 text-sm font-normal focus:outline-none focus:border-primary pr-10 appearance-none"
            >
              <option>Central District Head Office</option>
              <option>Northern Regional Branch</option>
              <option>Southern Regional Branch</option>
            </select>
            {/* Custom dropdown chevron arrow matching Figma layout */}
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-base-content/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Work Experience Biography Textarea (Spans full width across both columns) */}
        <div className="form-control w-full md:col-span-2 mt-2">
          <label className="label py-1">
            <span className="label-text text-xs font-bold text-base-content/60 uppercase tracking-wide">
              Work Experience Biography
            </span>
          </label>
          <textarea
            name="bio"
            key={`bio-${profile?.bio}`}
            defaultValue={profile?.bio || ""}
            rows={4}
            className="textarea textarea-bordered w-full bg-base-100 border-base-300 text-sm focus:outline-none focus:border-primary resize-y leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

export default CredentialCardSetting;
