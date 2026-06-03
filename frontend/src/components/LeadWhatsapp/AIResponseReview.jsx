import { useState, useEffect } from "react";

function AIResponseReview({ aiResponse, user }) {
  const [responses, setResponses] = useState([]);

  // ⦁	AI Powered Response -
  // enable messages shown using dummyAIResponse.js as source,
  // enable edit & confirm and for stuff to show in ConvoHistory.jsx upon confirming

  useEffect(() => {
    // assuming API fetching is done outside of this component for now
    // due to the fact that we pass in dummy AI response
    const updateResponse = async () => {
      if (!aiResponse || !user || user.id === 0) return; // guard clause

      console.log(`user id is ${user.id}`);
      const properUser = aiResponse.find(
        (response) => response.userID === user.id,
      );
      const properResponse = properUser?.responses ?? [];
      console.log(`properResponse looks like ${properResponse}`);
      setResponses((prev) => [...prev, ...properResponse]);
    };

    updateResponse();
  }, [user]);

  return (
    <div className="flex">
      <div className="  rounded-2xl grow mt-5 p-4 card w-full bg-base-100 shadow-sm">
        <p className="font-semibold text-sm text-base-content">
          AI Powered Response
        </p>
        <p className="text-xs text-base-content/40 mt-0.5">
          Suggested response flow based on information fed and the call
          transcribed. Send upon confirmation.
        </p>

        {responses.length > 0 ? (
          <div>
            {responses.map((response) => (
              <div className = "flex">
                <div className="basis-7/8">
                  <div key={response.id} className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary opacity-70 p-2">
                      {response.content}
                    </div>
                  </div>
                </div>
                <div className="basis-1/8 flex justify-end gap-3 p-2">
                  <button
                    className="btn btn-neutral transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    fdprocessedid="ufksnr"
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                    fdprocessedid="ufksnr"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No AI Response configured for this client yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIResponseReview;
