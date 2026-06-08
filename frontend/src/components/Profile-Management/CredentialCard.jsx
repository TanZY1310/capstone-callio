function CredentialCard() {
  const agent = {
    renNumber: 123456,
    agency: 'AIA',
  };

  return (
    <div className="ml-5">
      {/* DaisyUI Card Container */}
      <div className="card w-full max-w-2xl bg-base-100/70 border border-neutral-200 shadow-sm backdrop-blur-md">
        <div className="card-body p-8">
          {/* Card Header Title */}
          <div className="mb-2">
            <h2 className="card-title text-lg font-bold text-base-content">
              Professional Details
            </h2>
          </div>

          {/* Form Layout Split Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* License Input Control Group */}
            <div className="form-control w-full">
              <label className="label p-0 mb-1" htmlFor="license">
                <span className="label-text text-xs text-base-content/50">
                  License Number (REN)
                </span>
              </label>
              <input
                type="text"
                id="license"
                value="REN 12345"
                disabled
                className="input input-bordered w-full text-sm disabled:bg-base-200/50 disabled:text-base-content/70 disabled:border-neutral-200"
              />
            </div>

            {/* Agency Branch Input Control Group */}
            <div className="form-control w-full">
              <label className="label p-0 mb-1" htmlFor="branch">
                <span className="label-text text-xs text-base-content/50">
                  Agency Branch
                </span>
              </label>
              <input
                type="text"
                id="branch"
                value="IQI Global - Klang Valley"
                disabled
                className="input input-bordered w-full text-sm disabled:bg-base-200/50 disabled:text-base-content/70 disabled:border-neutral-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialCard;
//
