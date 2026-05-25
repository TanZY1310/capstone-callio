function ConvoHistory() {
  {
    /*ask AI how to code this beforehand, on stuff I can code pre-backend linking*/
  }

  return (
    <>
      <div className="flex">
        <div className="grow justify-start ml-18 mt-5 mr-20 pl-4 pt-4 card w-full bg-[#FFFFFF] shadow-sm">
          <h2 style={{ color: "#000000" }}>WhatsApp Conversation History</h2>
          <h3>whatever to fill in here</h3>

          <>
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Obi-Wan Kenobi
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                  />
                </div>
              </div>
              <div className="chat-header">
                Anakin
                <time className="text-xs opacity-50">12:46</time>
              </div>
              <div className="chat-bubble">I hate you!</div>
              <div className="chat-footer opacity-50">Seen at 12:46</div>
            </div>
          </>
        </div>
      </div>
    </>
  );
}

export default ConvoHistory;
