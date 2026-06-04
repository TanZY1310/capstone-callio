import { useState } from "react";

function AIResponseReview({ aiResponses, onEdit, onConfirm }) {
  // ⦁	AI Powered Response -
  // enable messages shown using dummyAIResponse.js as source,
  // enable edit & confirm and for stuff to show in ConvoHistory.jsx upon confirming
  // track which response is being edited and its current text
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  // Called by AIResponseReview Edit button
  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditText(content);
  };

  const handleSave = (id) => {
    // update responses in parent via onEdit prop
    onEdit(id, editText);
    setEditingId(null);
    setEditText("");
  };

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

        {aiResponses.length > 0 ? (
          <div>
            {aiResponses.map((response) => {
              const isEditing = editingId === response.id;
              return (
                <div key={response.id} className="flex">
                  <div className="basis-7/8">
                    {isEditing ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded" 

                      />
                    ) : (
                      <div className="chat-bubble chat-bubble-primary opacity-70 p-2 m-1">
                        {response.content}
                      </div>
                    )}
                  </div>
                  <div className="basis-1/8 flex justify-end gap-3 p-2">
                    <button
                      className="btn btn-neutral transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      onClick={() =>
                        isEditing
                          ? handleSave(response.id)
                          : handleEdit(response.id, response.content)
                      }
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                    <button
                      className="btn btn-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      onClick={() => onConfirm(response.content)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              );
            })}
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
