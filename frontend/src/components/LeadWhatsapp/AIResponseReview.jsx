function AIResponseReview() {
  return (
    <div className="flex">
      <div className="grow ml-18 mt-5 mr-20 pl-4 pt-4 card w-full bg-base-100 shadow-sm">
        <h2 className="text-base-content">AI Powered Response</h2>
        <h3 className="text-base-content/50 text-sm">
          Suggested response flow based on information fed and the call transcribed. Send upon confirmation.
        </h3>

        <div className="py-4">
          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Me"
                  src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                />
              </div>
            </div>
            <div className="chat-header text-base-content">
              Me
              <time className="text-xs opacity-50 ml-1">09:45</time>
            </div>
            <div className="chat-bubble chat-bubble-primary opacity-70">message 1 here</div>
          </div>

          <div className="chat chat-end">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Me"
                  src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                />
              </div>
            </div>
            <div className="chat-header text-base-content">
              Me
              <time className="text-xs opacity-50 ml-1">09:45</time>
            </div>
            <div className="chat-bubble chat-bubble-primary opacity-70">message 2 here</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-base-300">
          <button className="btn btn-neutral">Edit</button>
          <button className="btn btn-success">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default AIResponseReview;
