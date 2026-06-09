function UserInsightCard(){
    return(
       /* Removed the outer wrapper div. This card element is now a direct child of the flex container */
    <div className="card bg-[#111827] text-white rounded-xl p-6 shadow-sm grow flex flex-col justify-center w-full">
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <p className="text-[13px] leading-relaxed text-slate-400">
          Your identity was verified on{' '}
          <span className="text-white">Oct 12, 2023</span>. This allows
          you to manage high-value listings.
        </p>
      </div>

      {/* Progress/Sync Health Section */}
      <div className="mt-auto">
        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
          <div
            className="bg-emerald-400 h-1.5 rounded-full"
            style={{ width: '85%' }}
          ></div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider">
          <span>Sync Health</span>
          <span className="text-emerald-400 font-bold">85% Excellent</span>
        </div>
      </div>
    </div>
    )
}

export default UserInsightCard;