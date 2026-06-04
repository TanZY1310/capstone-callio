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
    <div className="card bg-base-100   p-5">
      <h2 className="card-title text-base-content" style={{ padding: "5px" }}>
        Top Objections
      </h2>

      {issues.map((item, index) => (
        <div
          key={index}
          className="badge badge-md badge-soft badge-error"
          style={{ marginBottom: "10px" }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Objections;
