function NextAction({ data }) {
  return (
    <div className="card bg-base-100 border border-base-200 w-full max-w-[1100px] ml-60">
      <div className="card-body gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="card-title text-base-content">Next Actions</h2>
          <p className="text-sm text-base-content/50">
            AI-generated follow-up recommendations based on buyer conversation
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {data?.nextActions?.map((action, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-base-200 border border-base-200 rounded-xl hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-center min-w-9 h-9 rounded-full bg-neutral text-neutral-content font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-sm text-base-content">
                  Recommended Action
                </span>
                <span className="text-sm leading-relaxed text-base-content/60">
                  {action}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 p-5 bg-neutral rounded-xl">
          <span className="font-bold text-sm text-neutral-content">
            🤖 AI Workflow Suggestion
          </span>
          <span className="text-sm text-neutral-content/70 leading-relaxed">
            Complete all recommended follow-up actions within the next 24 hours
            to maximize conversion probability and maintain buyer engagement.
          </span>
        </div>
      </div>
    </div>
  );
}
export default NextAction;
