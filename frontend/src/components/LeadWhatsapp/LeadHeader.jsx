import Header from '../Layout/Header';
import { NavLink } from 'react-router-dom';
import Select from 'react-select';

function LeadHeader({ user, users, onHeaderChange }) {
  const options = users.map((u) => ({
    value: u.cust_id,
    label: u.cust_name,
  }));
  console.log(options);

  return (
    <>
      <Header
        h1="WhatsApp Conversation"
        p="View and chat with customers, AI powered response"
      />

      <div className="flex justify-between items-center rounded-2xl px-6 py-4">
        <div className="flex justify-start items-center gap-2">
          <p className="font-semibold text-base text-base-content pr-2 pt-2">
            Lead Pipeline
          </p>
          <Select
            unstyled
            classNames={{
              container: () => 'w-50',
              control: () =>
                'bg-base-100 border border-base-300 rounded-lg px-2',
              menu: () => 'bg-base-100 border border-base-300 rounded-lg mt-1',
              option: (state) =>
                state.isFocused
                  ? 'bg-base-200 text-base-content px-2 py-1'
                  : 'text-base-content px-2 py-1',
              singleValue: () => 'text-base-content',
            }}
            isSearchable={true}
            placeholder="Type to search"
            options={options}
            value={options.find((o) => o.value === user?.cust_id) ?? null}
            onChange={onHeaderChange}
          >
            {/* optional chain: user may not have cust_id on first render */}
          </Select>
        </div>

        <NavLink to="/profile">
          <button className="btn btn-neutral">Upload PDF Files Here</button>
        </NavLink>
      </div>
    </>
  );
}
export default LeadHeader;
