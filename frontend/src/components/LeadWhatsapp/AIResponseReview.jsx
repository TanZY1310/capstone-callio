import { useState } from "react";

function AIResponseReview({ aiResponses, onGenerate, onEdit, onRegenerate, onConfirm }) {
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
    <div className="rounded-2xl mt-2 p-4 card w-full bg-base-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-base-content">
              AI Powered Response
            </p>
            <p className="text-xs text-base-content/40 mt-0.5">
              Suggested response flow based on information fed and the call
              transcribed. Send upon confirmation.
            </p>
          </div>
          <button
            className="btn btn-sm btn-primary transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            onClick={() => onGenerate()}
          >
            Generate
          </button>
        </div>

        {aiResponses.length > 0 ? (
          <div>
            {aiResponses.map((response) => {
              const isEditing = editingId === response.response_id;
              return (
                <div key={response.response_id} className="flex">
                  <div className="basis-8/9 flex justify-end">
                    {isEditing ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"

                      />
                    ) : (
                      <div className="chat-bubble chat-bubble-primary opacity-70 p-2 m-1 flex justify-end">
                        {response.content}
                      </div>
                    )}
                  </div>
                  <div className="basis-1/9 flex justify-end gap-3 p-2">
                    <button
                      className="btn btn-neutral transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      onClick={() =>
                        isEditing
                          ? handleSave(response.response_id)
                          : handleEdit(response.response_id, response.content)
                      }
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                    <button
                      className="btn btn-neutral transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      onClick={() => onRegenerate(response.response_id)}
                    >
                      Regenerate
                    </button>
                    <button
                      className="btn btn-success transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      onClick={() => onConfirm(response.response_id)}
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
  );
}

export default AIResponseReview;
