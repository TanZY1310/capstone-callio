import Header from "../Layout/Header";

function LeadHeader({ user, users, onHeaderChange }) {
  const openWhatsapp = (e) => {
    e.preventDefault();
    console.log("Opening whatsapp..."); //need to link to whatsapp page in the future
  };

  return (
    <>
      <Header
        h1="WhatsApp Conversation"
        p="View and chat with customers, AI powered response"
      />

      <div className="flex justify-between items-center rounded-2xl pl-8 pt-6 pb-6 bg-base-100">
        <div className="flex justify-start items-center gap-2">
          <p className="font-semibold text-sm text-base-content">
            Lead Pipeline
          </p>
          <button className="btn btn-sm">
            <select value={user.id} onChange = {onHeaderChange}>
              {users.map((u) => (
                <option key={u.cust_id} value={u.cust_id}>
                  {u.name}
                </option>
              ))}
            </select>
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-md btn-success mr-4 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            fdprocessedid="ufksnr"
            onClick={openWhatsapp}
          >
            Open Whatsapp
          </button>
        </div>
      </div>
    </>
  );
}
export default LeadHeader;
