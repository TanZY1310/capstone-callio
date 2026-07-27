import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function AIResponseReview({
  aiResponses,
  isGenerating,
  onGenerate,
  onEdit,
  onRegenerate,
  onConfirm,
}) {
  // track which response is being edited and its current text
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    padding: '40px',
    borderRadius: '8px',
  };

  const spinnerStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '4px solid var(--color-base-300)',
    borderTopColor: 'var(--color-primary)',
    willChange: 'transform',
  };
  // Called by AIResponseReview Edit button
  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditText(content);
  };

  const handleSave = (id) => {
    // update responses in parent via onEdit prop
    onEdit(id, editText);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="rounded-2xl mt-2 p-4 card w-full bg-base-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text text-base-content">
            AI Powered Response
          </p>
          <p className="text-sm text-base-content/70 mt-0.5">
            Suggested response flow based on information fed and the call
            transcribed. Send upon confirmation.
          </p>
        </div>
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <dialog className="modal modal-open">
              <div
                className="container modal-box items-center text-center"
                style={containerStyle}
              >
                <motion.div
                  className="spinner"
                  style={spinnerStyle}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <div>
                  <h3>Generating...</h3>
                </div>
              </div>
            </dialog>
          ) : (
            <button
              className="btn btn-sm btn-primary transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              onClick={() => onGenerate()}
            >
              Generate
            </button>
          )}
        </AnimatePresence>
      </div>

      {aiResponses.length > 0 ? (
        <div>
          {aiResponses.map((response) => {
            const isEditing = editingId === response.response_id;
            return (
              <div key={response.response_id} className="flex">
                <div className="basis-8/9 flex justify-end">
                  {isEditing ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <div className="chat-bubble chat-bubble-primary opacity-100 p-4 m-1">
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
                    {isEditing ? 'Save' : 'Edit'}
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
