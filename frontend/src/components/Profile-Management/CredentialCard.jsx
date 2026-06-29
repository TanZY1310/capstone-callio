function CredentialCard({ license_number, agency_branch, bio }) {
  return (
    <div className="w-full">
      {/* Removed max-w-2xl so it scales 100% horizontally.
        Changed bg-base-100/70 to match the exact background style profileCard uses.
      */}
      <div className="card w-full bg-base-100 border border-base-200 shadow-sm backdrop-blur-md">
        <div className="card-body p-6">
          {/* Card Header Title */} 
          <div className="mb-2">
            <h2 className="card-title text-lg font-bold text-base-content">
              Professional Details
            </h2>
          </div>

          {/* Form Layout Split Grid */}
          {/* Using a custom responsive max-width layout on the input grid itself ensures 
              the form fields don't stretch awkwardly wide on huge desktop monitors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
            {/* License Input Control Group */}
            <div className="form-control w-full">
              <label className="label p-0 mb-1.5" htmlFor="license">
                <span className="label-text text-xs text-base-content/50 font-medium">
                  License Number (REN)
                </span>
              </label>
              <input
                type="text"
                id="license"
                value={license_number}
                disabled
                className="input input-bordered w-full text-sm bg-base-200/50 border-base-300 text-base-content/80 disabled:bg-base-200/50 disabled:text-base-content/80 disabled:border-base-300"
              />
            </div>

            {/* Agency Branch Input Control Group */}
            <div className="form-control w-full">
              <label className="label p-0 mb-1.5" htmlFor="branch">
                <span className="label-text text-xs text-base-content/50 font-medium">
                  Agency Branch
                </span>
              </label>
              <input
                type="text"
                id="branch"
                value={agency_branch}
                disabled
                className="input input-bordered w-full text-sm bg-base-200/50 border-base-300 text-base-content/80 disabled:bg-base-200/50 disabled:text-base-content/80 disabled:border-base-300"
              />
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label p-0 mb-1.5" htmlFor="branch">
              <span className="label-text text-xs text-base-content/50 font-medium">
                Bio
              </span>
            </label>
            <input
              type="text"
              id="bio"
              value={bio}
              disabled
              className="input input-bordered w-full text-sm bg-base-200/50 border-base-300 text-base-content/80 disabled:bg-base-200/50 disabled:text-base-content/80 disabled:border-base-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialCard;
//
