import { SendHorizontal } from "lucide-react";

function ConvoHistory({ messages, inputRef, onSend, onEnter }) {
  return (
    <div className="rounded-2xl p-4 card w-full bg-base-100 shadow-sm min-h-[400px] flex flex-col">
        <p className="font-semibold text-md text-base-content">WhatsApp Conversation History</p>
        <p className="text-sm text-base-content/40">End-to-end encrypted backup</p>

        {messages.length > 0 ? (
          <div className="flex flex-col flex-1">
            <div className="py-4 flex-1 overflow-y-auto max-h-[500px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat ${msg.fromMe === true ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-bubble whitespace-pre-wrap">{msg.body}</div>
                  <div className="chat-footer opacity-50">{new Date(msg.timestamp*1000).toString()}</div>
                </div>
              ))} {/*new Date(timestamp × 1000)*/}
            </div>

            <div className="flex items-center gap-2 p-4 border-t border-base-300">
              <textarea
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full"
                ref={inputRef}
                onKeyDown = {onEnter}
              />
              <button
                onClick={onSend}
                className="btn btn-success btn-circle ml-2 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                <SendHorizontal />
              </button>
            </div>
          </div>
        ) : (
          <p className="py-4 text-base-content/50">No chat history for this lead yet.</p>
        )}
    </div>
  );
}

export default ConvoHistory;
