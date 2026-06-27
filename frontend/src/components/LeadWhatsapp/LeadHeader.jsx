import Header from "../Layout/Header";

function LeadHeader({ user, users, onHeaderChange }) {
 

  return (
    <>
      <Header
        h1="WhatsApp Conversation"
        p="View and chat with customers, AI powered response"
      />

      <div className="flex justify-between items-center rounded-2xl px-6 py-4 bg-base-100">
        <div className="flex justify-start items-center gap-2">
          <p className="font-semibold text-base text-base-content pr-2 pt-2">
            Lead Pipeline
          </p>
          <button className="btn btn-md">
            <select value={user?.cust_id ?? ""} onChange = {onHeaderChange}>{/* optional chain: user may not have cust_id on first render */}
              {users.map((u) => (
                <option key={u.cust_id} value={u.cust_id}>{/* value changed from cust_name to cust_id so handleHeaderChange find() comparison matches */}
                  {u.cust_name}
                </option>
              ))}
            </select>
          </button>
        </div>
        
      </div>
    </>
  );
}
export default LeadHeader;
