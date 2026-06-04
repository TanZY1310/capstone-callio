import { useEffect, useState } from "react";

function Objections() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const data = [
      "Too Expensive",
      "Not Interested",
      "Wrong Area",
      "Call Back Later",
      "Wrong Number",
    ];
    setIssues(data);
  }, []);

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
      <h2 className="card-title text-base-content" style={{ padding: "5px" }}>
        Top Objections
      </h2>
      <div className="flex flex-col gap-2 w-full">
        {issues.map((item, index) => (
          <span key={index} className="badge badge-lg badge-soft badge-error">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Objections;
