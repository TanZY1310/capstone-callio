import { NavLink, Route, Routes } from "react-router-dom";
function Sidebar() {
  const Nav_Items = [
    { id: 1, label: "Customer Listings", icon: "", path: "" },
    { id: 2, label: "Speech Analysis", icon: "", path: "" },
    { id: 3, label: "WhatsApp Conversation", icon: "", path: "" },
    { id: 4, label: "Metrics", icon: "", path: "" },
  ];

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300">
            <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              {/* Sidebar toggle icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="my-1.5 inline-block size-4"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
            <div className="px-4">CALLIO</div>
          </nav>
          {/* Page content here */}
          <div className="p-4">Page Content</div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
              {/* List item */}
              <li>
                {Nav_Items.map((item) => (
                  <NavLink key={item.id} to={item.path}>
                    <button
                      className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                      data-tip={item.label}
                    >
                      <span className="is-drawer-close:hidden">{item.label}</span>
                    </button>
                  </NavLink>
                ))}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
