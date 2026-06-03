import { SendHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

function ConvoHistory({waHistory, user }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!waHistory || !user || user.id === 0) return; // guard clause

      // placeholder for real WA Business API call later
      let waApiUrl = "https://jsonplaceholder.typicode.com/users";
      const response = await fetch(waApiUrl);
      const data = await response.json();

      const userHistory = waHistory.find((u) => u.userID === user.id);
      const userMessages = userHistory?.messages ?? [];
      console.log("user.id:", user.id);
      console.log(
        "dummyWAHistory userIDs:",
        waHistory.map((u) => u.userID),
      );
      setMessages(userMessages); // setter called AFTER finding the right messages
    };

    fetchChatHistory();
  }, [user]);

  return (
    <div className="flex">
      <div className="grow  rounded-2xl ml-18 mt-5 mr-20 p-4 card w-full bg-base-100 shadow-sm">
        <p className="font-semibold text-sm text-base-content">WhatsApp Conversation History</p>
        <p className="text-xs text-base-content/40 mt-0.5">
          End-to-end encrypted backup
        </p>

        {messages.length > 0 ? (
          <div>
            <div className="py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat ${msg.role === "client" ? "chat-start" : "chat-end"}`}
                >
                  <div className="chat-bubble">{msg.content}</div>
                  <div className="chat-footer opacity-50">{msg.timestamp}</div>
                </div>
              ))}
            </div>

            <div
              id="response"
              className="flex items-center gap-2 p-4 border-t border-base-300"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="input input-bordered w-full"
              />
              <button className="btn btn-success btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110" fdprocessedid="ufksnr">
                <SendHorizontal />
              </button>
            </div>
          </div>
        ) : (
          <p className="py-4 text-base-content/50">
            No chat history for this lead yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ConvoHistory;
