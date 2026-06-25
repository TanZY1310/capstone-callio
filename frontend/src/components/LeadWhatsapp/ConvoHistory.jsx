import { SendHorizontal } from "lucide-react";

function ConvoHistory({ messages, inputRef, onSend }) {
  return (
    <div className="flex">
      <div className="grow rounded-2xl ml-18 mt-5 p-4 card w-full bg-base-100 shadow-sm">
        <p className="font-semibold text-sm text-base-content">WhatsApp Conversation History</p>
        <p className="text-xs text-base-content/40 mt-0.5">End-to-end encrypted backup</p>

        {messages.length > 0 ? (
          <div>
            <div className="py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat ${msg.fromMe === true ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-bubble">{msg.body}</div>
                  <div className="chat-footer opacity-50">{msg.timestamp}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-4 border-t border-base-300">
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full"
                ref={inputRef}
              />
              <button
                onClick={onSend}
                className="btn btn-success btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                <SendHorizontal />
              </button>
            </div>
          </div>
        ) : (
          <p className="py-4 text-base-content/50">No chat history for this lead yet.</p>
        )}
      </div>
    </div>
  );
}

export default ConvoHistory;
